# Gcode Modifier Research Notes

## 1. Fusion 360 Hobby Version Restrictions

### Known Blocks
- **G00 (Rapid Traverse)** — Removed or converted to G01 with slow feedrate
- **M06 (Tool Change)** — Blocked entirely
- **Spindle Control (M03/M04)** — May be restricted to slow RPM
- **Advanced Cycles** — Some canned cycles may be disabled

### Why Restricted?
Fusion 360 hobby version aims to prevent dangerous unattended operation on hobby CNC. Rapid movements without proper positioning can crash into material/fixtures.

### Workaround Approach
If Fusion replaces G00 with G01 (slow), we can:
1. Identify these slow linear moves
2. Restore them as G00 (rapid)
3. Add safety checks (tool clearance verification)

---

## 2. Gcode Syntax Reference

### Key G-codes
```
G00  — Rapid positioning (fast, no cutting)
G01  — Linear interpolation at specified feedrate
G02  — Clockwise arc
G03  — Counter-clockwise arc
G04  — Dwell (pause)
G28  — Home / machine reference point
G54–G59  — Coordinate system selection
G90  — Absolute positioning
G91  — Incremental positioning
```

### Key M-codes (Miscellaneous)
```
M00  — Program stop
M01  — Optional stop
M03  — Spindle ON (clockwise)
M04  — Spindle ON (counter-clockwise)
M05  — Spindle OFF
M06  — Tool change
M30  — End of program
M99  — End of subprogram
```

### Example G01 → G00 Conversion
```
; Fusion hobby output (G01 with very slow feedrate)
G01 Z5.000 F100   ; Move up at 100 mm/min (slow!)

; After modification (G00)
G00 Z5.000        ; Rapid up (no feedrate specified, uses rapid default)
```

### M06 Tool Change Syntax
```
T01 M06           ; Select tool 1 and execute tool change
G43 H01 Z1.0      ; Apply tool length offset (H01) and move to safe height
```

---

## 3. Detection Strategy: How to Identify G00 Blocks

### Approach 1: Feedrate Analysis
- Find all G01 blocks with feedrate < threshold (e.g., 200 mm/min)
- Check if block is Z-axis only (vertical move)
- If safe, convert to G00

**Pros:** Simple, works if Fusion just slows down G00
**Cons:** May miss some blocks, could create dangerous moves

### Approach 2: Comment Preservation
- Check if Fusion adds comments like `; Rapid (blocked)`
- Parse comments, restore original intent

**Pros:** Most accurate if comments exist
**Cons:** Depends on Fusion's output format

### Approach 3: Machine State Analysis
- Track tool position, active offsets, compensation mode
- If G01 move is to a known safe zone (above part), convert to G00

**Pros:** Safest (respects machine state)
**Cons:** Complex, requires CAM knowledge

---

## 4. Tool Change Insertion Logic

### Challenge
Fusion blocks M06, so we need to identify where tool changes *should* have occurred.

### Detection Methods

**A. From Tool Number Changes**
```
; Tool 1 operations
G01 X10 Y10
G01 Z-5
; ... (tool 1 cuts)

; If Fusion blocks M06, tool might just restart (heuristic)
G01 X20 Y20    ; Could be new tool
```

**B. From Fusion Output Comments**
If Fusion preserves tool info in comments:
```
; T01 - 3.175mm End Mill
G01 X10 Y10

; T02 - 0.8mm Engraver (tool change blocked here)
G01 X20 Y20
```

**C. User Configuration**
User manually specifies tool library + change points:
```json
{
  "tools": [
    {"id": 1, "name": "3.175mm End Mill", "offset_z": 12.5},
    {"id": 2, "name": "0.8mm Engraver", "offset_z": 8.2}
  ],
  "changes": [
    {"line": 50, "from": 1, "to": 2}
  ]
}
```

---

## 5. File Merging Safety

### Challenge
Joining multiple gcode files can corrupt machine state if not careful.

### State to Preserve Between Files
1. **Current Tool (Tn)**
2. **Active Offsets (G54–G59, G43/G44)**
3. **Coordinate System (G90/G91, G20/G21)**
4. **Spindle State (M03/M04/M05)**
5. **Feedrate (Fn)**

### Safe Merge Strategy
```
[File 1: Gcode]
M30          ; Program end

[Before File 2, insert reset block]
G90          ; Reset to absolute positioning
G54          ; Reset to default offset
M05          ; Spindle off
G01 Z10 F200 ; Move to safe height

[File 2: Gcode]
```

### Issues to Handle
- Comments spanning files
- Subprogram calls (Mn with P parameter)
- Multiple program ends (M30)
- State collisions (spindle already on, etc.)

---

## 6. Implementation Plan

### Phase 1: Parser
```python
class GcodeParser:
    def tokenize(self, gcode_text) -> List[Token]
        # Split into lines, parse G/M/F/X/Y/Z/etc.
    
    def parse(self, tokens) -> List[Command]
        # Build command objects with metadata
```

### Phase 2: Modifier
```python
class GcodeModifier:
    def restore_rapids(self, commands) -> List[Command]
        # G01 → G00 conversion
    
    def inject_tool_changes(self, commands) -> List[Command]
        # Insert M06 where needed
    
    def merge_files(self, file_list) -> List[Command]
        # Concatenate safely
```

### Phase 3: Writer
```python
class GcodeWriter:
    def to_string(self, commands) -> str
        # Serialize back to gcode format
```

---

## 7. Edge Cases & Gotchas

### Parser Challenges
- **Comments:** `G01 X10 ; Move right`
- **Whitespace:** Variable spacing
- **Case sensitivity:** G vs g (varies by controller)
- **Incremental vs Absolute:** G91 vs G90
- **Subunits:** Some use inches, some mm

### Modifier Challenges
- **Non-linear conversions:** Arc moves (G02/G03) shouldn't convert to G00
- **Compensation:** Tool radius compensation (G41/G42) affects safety
- **Probing:** Probe commands need special handling
- **Macro variables:** Some gcode uses #variable substitution

### Machine-Specific Issues
- **Different CNC controllers:** Haas, Mach3, LinuxCNC, Grbl all have quirks
- **Spindle limits:** Hobby spindles can't handle Fusion's recommended RPM
- **Tool library:** Different machines have different tool slots/offsets

---

## 8. Testing Strategy

### Test Files Needed
1. **Simple G01 conversions** — Basic vertical moves
2. **Mixed moves** — G01 + G02/G03 (only G01 should convert)
3. **Tool changes** — Where M06 should be injected
4. **File merges** — Multiple files with state preservation
5. **Edge cases** — Comments, subprograms, offsets

### Validation Checklist
- [ ] Parser handles all syntax variants
- [ ] Restored G00 moves are safe (Z-only, above part)
- [ ] Tool changes don't interrupt cutting
- [ ] Merged files preserve machine state
- [ ] Comments preserved
- [ ] Output is valid gcode for target controller

---

## References

### Gcode Standards
- ISO 6983 (International standard for CNC programming)
- NIST RS274/NGC (Reference implementation)

### Fusion 360 Resources
- Autodesk Fusion 360 CAM documentation
- Hobby version limitations guide

### Hobby CNC Platforms
- Grbl (Arduino-based, common in hobby)
- Mach3 (Windows-based CNC controller)
- LinuxCNC (Open-source motion control)

---

## Next Actions

1. **Find sample Fusion 360 hobby gcode** — See what restrictions look like
2. **Get gcode samples with tool changes** — Understand tool change format
3. **Test on real CNC** — Validate safety of conversions
4. **Build parser MVP** — Start with basic tokenizer
5. **Write edge case tests** — Prevent regressions

