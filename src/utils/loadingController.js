let _start = () => { };
let _stop = () => { };

export const loadingController = {
    start: () => _start(),
    stop: () => _stop(),
    setHooks: (startFn, stopFn) => {
        _start = startFn;
        _stop = stopFn;
    },
};
