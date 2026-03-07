# Gcode Modifier TODO

## Research Phase
- [ ] **Gcode Fundamentals** — Read ISO 6983 gcode spec (G-code language reference)
- [ ] **Fusion 360 Hobby Blocks** — Document exactly what's restricted
- [ ] **G00 vs G01** — When Fusion blocks G00, how does it replace it? (linear feedrate?)
- [ ] **Tool Change Logic** — How M06 works, tool tables, probe logic
- [ ] **File Merging Safety** — How to safely concatenate gcode (state preservation)
- [ ] **Edge Cases** — Comments, subprograms, offsets, canned cycles

## Architecture Design
- [ ] GcodeParser class (tokenize + parse)
- [ ] GcodeModifier class (rules engine for transformations)
- [ ] GcodeWriter class (serialize back to gcode)
- [ ] Configuration (feed rates, tool library, spindle limits)

## Implementation Phase
- [ ] G00 Restoration (detect G01 blocks, convert back to G00 where safe)
- [ ] M06 Injection (insert tool changes at logical points)
- [ ] Feed Rate Scaling (respect hobby spindle/motor limits)
- [ ] File Merger (concatenate + reset state between files)

## Testing
- [ ] Unit tests (parser, modifier, writer)
- [ ] Integration tests (real Fusion output)
- [ ] Edge case tests (comments, subprograms, etc.)
- [ ] CNC validation (test on actual hobby CNC)

## Docs
- [ ] Gcode reference guide
- [ ] Fusion 360 restrictions breakdown
- [ ] User guide (how to use modifier)
- [ ] Examples (before/after gcode)
