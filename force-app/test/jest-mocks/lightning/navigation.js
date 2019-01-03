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

/**
 *
 */
export const getNavigateCalledWith = () => {
    return {
        pageReference: _pageReference,
        replace: _replace,
    }
};
