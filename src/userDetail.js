class UserDetails {
  constructor(userAccounts) {
    this.accounts = userAccounts;
  }

  addUser(newUser) {
    this.accounts[newUser.userName] = { password: newUser.password };
  }
}
module.exports = UserDetails;
