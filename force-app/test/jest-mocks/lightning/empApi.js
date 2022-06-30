var _mockIsEmpEnabled = true;
var _mockErrorCallback;
var _mockSubscribeError;
var _mockSubscribeCallback;

// empApi methods mocks
const isEmpEnabled = jest.fn(() => Promise.resolve(_mockIsEmpEnabled));

const setDebugFlag = jest.fn(() => {});

const onError = jest.fn((callback) => {
    _mockErrorCallback = callback;
});

const subscribe = jest.fn((channel, replayId, callback) => {
    if (_mockSubscribeError) {
        return Promise.reject(_mockSubscribeError);
    }
    _mockSubscribeCallback = callback;
    return Promise.resolve();
});

const unsubscribe = jest.fn(() => {});

// Mock empApi object
export { isEmpEnabled, setDebugFlag, onError, subscribe, unsubscribe };

// Extra mock control methods
const resetMock = () => {
    _mockIsEmpEnabled = true;
    _mockErrorCallback = undefined;
    _mockSubscribeError = undefined;
    _mockSubscribeCallback = undefined;
};

const setMockEmpEnabled = (isEnabled) => {
    _mockIsEmpEnabled = isEnabled;
};

const fireMockError = (error) => {
    _mockErrorCallback(error);
};

const setMockSubscribeError = (error) => {
    _mockSubscribeError = error;
};

const fireMockEvent = (event) => {
    _mockSubscribeCallback(event);
};

export const empApiMock = {
    resetMock,
    setMockEmpEnabled,
    fireMockError,
    setMockSubscribeError,
    fireMockEvent
};
