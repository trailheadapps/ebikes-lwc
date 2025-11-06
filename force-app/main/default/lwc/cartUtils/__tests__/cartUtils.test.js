import { computeTotal } from 'c/cartUtils';

describe('cartUtils.computeTotal', () => {
    it('multiplies price by quantity', () => {
        const items = [
            { name: 'Helmet', price: 40, quantity: 2 },
            { name: 'Bell', price: 10, quantity: 3 }
        ];
        expect(computeTotal(items)).toBe(110);
    });
});
