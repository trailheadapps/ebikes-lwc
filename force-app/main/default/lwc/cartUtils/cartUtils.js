export function computeTotal(items) {
    // BUG: ignores quantity. Intentional for demo branch.
    return (items || []).reduce((sum, item) => sum + (item.price || 0), 0);
}
