class UserDetails {
  constructor(userAccounts) {
    this.accounts = userAccounts;
  }

  addUser(newUser) {
    this.accounts[newUser.userName] = {
      password: newUser.password,
      TODOs: { work: { discription: "MY todo", list: [] } }
    };
  }
}

module.exports = UserDetails;
