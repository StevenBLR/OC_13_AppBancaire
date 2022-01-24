const initialState = {
  loggedIn: false,
  user: null,
  sessionToken: null,
};

// Fonction qui créee une action (Action Creator)
const loginAction = (user) => ({
  type: "loggedIn",
  payload: { user: user },
});

function reducer(state, action) {}
