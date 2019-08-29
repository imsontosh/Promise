// Create a small function which will have an option to  make a cancellable ajax call using Promise.
// How to Cancel Your Promise
// You can not cancel a promise, and this is a real problem.
// Core Javascript

// Ajax simulation
function ajaxSimulation() {
    return new Promise((resolve, reject) => {
        console.log("ajax started ");
        setTimeout(() => {
            resolve("ajax");
        }, 5000);
    });
}

//Wrapper funtion
//Internally uses another promise to control the resolve and rejcect based on use action
function wrapCancel(ajaxSimulation) {
    let resolve,
        reject,
        promise,
        cancel = false;

    promise = new Promise((lResolve, lReject) => {
        resolve = lResolve;
        reject = lReject;
    });

    //Resolve Handler
    const promiseResolve = () => {
        ajaxSimulation()
            .then(result => {
                if (!cancel) {
                    resolve(result);
                }
            })
            .catch(err => {
                reject(err);
            });
    };
    //Reject handler
    const promiseReject = () => {
        cancel = true;
        reject("cancelled by user");
    };

    //Wrapper
    return {
        promise: () => {
            promiseResolve();
            return promise;
        },
        cancel: promiseReject
    };
}

const { promise, cancel } = wrapCancel(ajaxSimulation);

promise()
    .then(result => {
        console.log(result);
    })
    .catch(err => {
        console.log(err);
    });

setTimeout(() => {
    cancel();
}, 1000);
