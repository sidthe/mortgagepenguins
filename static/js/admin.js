var UserBox = React.createClass({
    loadUsersFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleUserAdminUpdate: function(userdata) {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: userdata,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return {data: []};
    },

    componentDidMount: function() {
        this.loadUsersFromServer();
        setInterval(this.loadUsersFromServer, this.props.pollInterval);
    },

    render: function() {
        return (
            <div className="userBox">
                <div className="container-edit-button">
                    <UpdateAdminUserForm onAdminUserUpdate={this.handleUserAdminUpdate} refreshOnUpdate={this.loadUsersFromServer} data={this.state.data}/>
                </div>
                <div className="container">
                    <UserList data={this.state.data}/>
                </div>
            </div>
        );
    }
});

var UserList = React.createClass({

    render: function() {
        return (
            <div className="userList">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Surname</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Company</th>
                            <th>Signup Date (UTC)</th>
                            <th>Active</th>
                            <th>User Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.data.map(function(users) {
                            return (
                                <tr key={users.username}>
                                    <td>{users.firstname}</td>
                                    <td>{users.lastname}</td>
                                    <td>{users.username}</td>
                                    <td>{users.email}</td>
                                    <td>{users.company}</td>
                                    <td>{users.signup_date}</td>
                                    <td>{users.active_status.toString()}</td>
                                    <td>{users.user_role}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
});
var UpdateAdminUserForm = React.createClass({
    getInitialState: function() {
        return {active_status: '', user_role: '', username: ''};
    },
    handleStatusChange: function(e) {
        this.setState({active_status: e.target.value});
    },
    handleRoleChange: function(e) {
        this.setState({user_role: e.target.value});
    },
    handleUsernameChange: function(e) {
        this.setState({user: e.target.value});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var status = this.state.active_status;
        var role = this.state.user_role;
        var user = this.state.user;
        if (!user) {
            return;
        }
        this.props.onAdminUserUpdate({active_status: status, user_role: role, username: user});
        this.props.refreshOnUpdate();
    },

    render: function() {
        return (
            <div>
                <button type="button" className="btn btn-primary pull-right glyphicon glyphicon-edit" data-toggle="modal" data-target="#userEditModal">
                    <span className="btn-icon-text">Edit User</span>
                </button>
                <div className="modal fade modal-edit" id="userEditModal" tabIndex="-1" role="dialog" aria-labelledby="userEditModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content modal-three">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">
                                    <span aria-hidden="true">&times;</span>
                                    <span className="sr-only">Close</span>
                                </button>
                                <h4 className="modal-title glyphicon glyphicon-edit" id="userEditModalLabel">
                                    <span className="btn-icon-text">Edit User</span>
                                </h4>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group select-width">
                                        <select className="form-control" onChange={this.handleUsernameChange} required="true">
                                            <option value="" defaultValue>Select user</option>
                                            {this.props.data.map(function(data) {
                                                return (
                                                    <option key={data.username} value={data.username}>{data.username}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                    <div className="form-group select-width">
                                        <select className="form-control" onChange={this.handleStatusChange}>
                                            <option value="" defaultValue>Set status</option>
                                            <option key='activestatus' value='1'>Active</option>
                                            <option key='disabledstatus' value='0'>Blocked</option>
                                        </select>
                                    </div>
                                    <div className="form-group select-width">
                                        <select className="form-control" onChange={this.handleRoleChange}>
                                            <option value="" defaultValue>User Role</option>
                                            <option key='3213442' value='1'>Trial</option>
                                            <option key='2232312' value='2'>User</option>
                                            <option key='3213231' value='64'>Admin</option>
                                        </select>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                        <input type="submit" className="btn btn-primary" value="Update"/>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <UserBox url="/api/v1/users" pollInterval={10000}/>, document.getElementById('adminBox'));
