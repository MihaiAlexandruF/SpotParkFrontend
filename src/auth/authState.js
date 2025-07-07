export let setAuthState = () => {};
export let setUserState = () => {};

export const setAuthHandlers = (authHandler, userHandler) => {
  setAuthState = authHandler;
  setUserState = userHandler;
};
