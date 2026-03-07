# Fusion 360 Gcode Modifier

**Purpose:** Remove hobby version restrictions from Fusion 360 gcode output
- Enable rapid movements (G00)
- Enable tool changes (M06)
- Join multiple gcode files
- Modify spindle speeds/feeds for hobby hardware

**Status:** Research phase

**Project Structure:**
- `src/` — Python gcode parser/modifier
- `docs/` — Technical research + gcode specs
- `tests/` — Test gcode files + validation
- `README.md` — This file

## Blocked Features in Hobby Fusion 360
1. **Rapid movements (G00)** — Replaced with linear feed moves (G01)
2. **Tool changes (M06)** — Removed entirely
3. **Spindle control (M03/M04)** — May be restricted
4. **Feed rate optimization** — Forced to slow speeds

## Research Needed
- [ ] Gcode syntax (G00, G01, M06, etc.)
- [ ] Fusion 360 hobby restrictions (what exactly is blocked?)
- [ ] Rapid movement conversion strategy
- [ ] Tool change insertion logic
- [ ] File joining/concatenation safety
- [ ] Parser robustness (edge cases)

## Next Steps
1. Research gcode spec + Fusion 360 restrictions
2. Build gcode parser (tokenizer + validator)
3. Implement G00 restoration
4. Implement M06 tool change insertion
5. Build file merger
6. Test with real Fusion 360 output
