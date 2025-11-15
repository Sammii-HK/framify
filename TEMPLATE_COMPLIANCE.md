# Template Compliance & Quality Assurance

## 🎯 Quality Standards

All templates must meet these standards before being saved:

### Minimum Requirements (Score ≥ 60)
- ✅ Responsive design (sm:, md:, lg: breakpoints)
- ✅ Typography hierarchy (text-*, font-* classes)
- ✅ Color palette (bg-*, text-* classes)
- ✅ Runtime safety (no undefined property access)
- ✅ TypeScript types
- ✅ Basic documentation

### Quality Thresholds

**Score ≥ 75**: ✅ Auto-accepted (after retry if needed)
**Score 60-74**: ⚠️ Accepted with warnings
**Score < 60**: ❌ **REJECTED** - Template not saved

### Runtime Safety Rules

Templates are **REJECTED** if they have:
- More than 2 potential undefined access issues
- Missing default values for arrays/objects
- Unsafe property access patterns

## 🔄 Auto-Retry System

If a template scores < 75:
1. **Attempt 1**: Generate template
2. **Attempt 2**: Regenerate if score < 75
3. **Attempt 3**: Final attempt
4. **Result**: Accept if score ≥ 75, or reject if still < 60

## ✅ Validation Checks

### 1. Responsive Design
- Must include: `sm:`, `md:`, `lg:` breakpoints
- Mobile-first approach
- No fixed widths without responsive alternatives

### 2. Typography Hierarchy
- Must use: `text-*` and `font-*` Tailwind classes
- Proper heading sizes: `text-3xl`, `text-4xl`, etc.
- Font weights: `font-normal`, `font-semibold`, `font-bold`

### 3. Runtime Safety
- All variables defined before use
- Default values: `const { items = [] } = props`
- Optional chaining: `data?.title` instead of `data.title`
- No undefined property access

### 4. Performance
- Animate only: `transform`, `opacity`, `scale`, `rotate`
- Never animate: `width`, `height`, `left`, `top`, `margin`, `padding`
- Use `will-change` for animated elements

### 5. Code Quality
- TypeScript interfaces for props
- Documentation comments
- Placeholder content for customization
- Safe, commercially-usable assets

## 🚫 Rejection Criteria

Templates are **automatically rejected** if:
- Quality score < 60
- More than 2 runtime safety issues
- Missing critical responsive design
- Missing typography hierarchy

## 📊 Quality Score Breakdown

- **100 points** total
- **-15 points**: Missing responsive design
- **-10 points**: Missing typography hierarchy
- **-10 points**: Missing color palette
- **-15 points**: Missing customizable content
- **-10 points**: Performance issues
- **-10 points**: Missing documentation
- **-10 points**: Missing TypeScript types
- **-20 points**: Unsafe assets
- **-5 points**: Each runtime safety issue

## 🔍 Preview Display

The preview shows:
- **Left side**: Code editor (50% width)
- **Right side**: Live rendered preview (50% width)
- **Resizable panels**: Drag to adjust sizes
- **Error display**: Shows runtime errors with copy button
- **Console**: Available via console button

## 📝 What Gets Saved

Only templates that:
- ✅ Score ≥ 60
- ✅ Have ≤ 2 runtime safety issues
- ✅ Include responsive design
- ✅ Include typography hierarchy

Are saved to the database.

## 🛠️ Manual Review

If a template is rejected:
1. Check the error message for specific issues
2. Try regenerating with a more detailed prompt
3. Try a different style
4. Review the quality issues list

## 🎨 Preview Features

- **Live Preview**: See rendered component in real-time
- **Code View**: Switch to code-only view
- **Error Capture**: Automatic error detection
- **Copy Error**: Copy error messages for debugging
- **Download**: Export as `.tsx` file
- **Export to Framer**: Direct export to Framer project

