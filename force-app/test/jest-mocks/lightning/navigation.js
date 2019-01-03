/**
 * For the original lightning/navigation mock that comes by default with
 * @salesforce/lwc-jest, see:
 * https://github.com/salesforce/lwc-jest/blob/master/src/lightning-mocks/navigation/navigation.js
 */
export const CurrentPageReference = jest.fn();

let _pageReference, _replace;

const Navigate = Symbol("Navigate");
const GenerateUrl = Symbol("GenerateUrl");
export const NavigationMixin = (Base) => {
    return class extends Base {
        [Navigate](pageReference, replace) {
            _pageReference = pageReference;
            _replace = replace;
        }
        [GenerateUrl](pageReference) {}
    };
};
NavigationMixin.Navigate = Navigate;
NavigationMixin.GenerateUrl = GenerateUrl;

/*
 * Tests will not have access to the internals of this mixin used by the
 * component under test so we save a reference to what the Navigate method is
 * called with and provide access to the params in the test via this function.
 */
export const getNavigateCalledWith = () => {
    return {
        pageReference: _pageReference,
        replace: _replace,
    }
};
