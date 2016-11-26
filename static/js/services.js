var ServicesBox = React.createClass({
    loadServicesFromServer: function() {
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

    handleServiceAdd: function(service) {
        var services = this.state.data;
        service.id = Date.now() * 1000
        var newService = services.concat([service]);
        this.setState({data: newService});
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: service,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleServiceDelete: function(service) {
        this.setState({
            data: this.state.data.filter((i) => i.service_number !== service.service_number)
        });
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'DELETE',
            data: service,
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
        this.loadServicesFromServer();
        setInterval(this.loadServicesFromServer, this.props.pollInterval);
    },

    render: function() {
        return (
            <div className="serviceBox">
                <div className="container-edit-button">
                    <DeleteServiceForm onServiceDelete={this.handleServiceDelete} refreshOnDelete={this.loadServicesFromServer} data={this.state.data}/>
                    <AddServiceForm onServiceAdd={this.handleServiceAdd}/>
                </div>
                <div className="container">
                    <ServiceList data={this.state.data}/>
                </div>
            </div>
        );
    }
});

var ServiceList = React.createClass({

    render: function() {
        return (
            <div className="serviceList">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Service Name</th>
                            <th>Phone Number</th>
                            <th>Custom Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.data.map(function(service) {
                            return (
                                <tr key={service.id}>
                                    <td>{service.service_name}</td>
                                    <td>{service.service_number}</td>
                                    <td>{service.custom_answer}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
});

var AddServiceForm = React.createClass({
    getInitialState: function() {
        return {service: '', phone: '', message: ''};
    },
    handleServiceChange: function(e) {
        this.setState({service: e.target.value});
    },
    handlePhoneChange: function(e) {
        this.setState({phone: e.target.value});
    },
    handleMessageChange: function(e) {
        this.setState({message: e.target.value});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var service = this.state.service.trim();
        var phone = this.state.phone.trim();
        var message = this.state.message.trim();
        if (!service || !phone) {
            return;
        }
        this.props.onServiceAdd({service_name: service, service_number: phone, custom_answer: message});
        this.setState({service: '', phone: '', message: ''});
    },

    render: function() {
        return (
            <div>
                <button type="button" className="btn btn-primary pull-right btn-space glyphicon glyphicon-plus" data-toggle="modal" data-target="#serviceAddModal">
                    <span className="btn-icon-text">
                        Add Service</span>
                </button>
                <div className="modal fade" id="serviceAddModal" tabIndex="-1" role="dialog" aria-labelledby="serviceAddModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content modal-three">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">
                                    <span aria-hidden="true">&times;</span>
                                    <span className="sr-only">Close</span>
                                </button>
                                <h4 className="modal-title glyphicon glyphicon-plus" id="serviceAddModalLabel">
                                    <span className="btn-icon-text">
                                        Add Service</span>
                                </h4>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group select-width">
                                        <input className="form-control" type="text" placeholder="Service Name" required="true" value={this.state.service} onChange={this.handleServiceChange}/>
                                    </div>
                                    <div className="form-group select-width">
                                        <input className="form-control" type="text" placeholder="Phone ex:+12013000000" required="true" value={this.state.phone} onChange={this.handlePhoneChange}/>
                                    </div>
                                    <div className="form-group select-width">
                                        <input className="form-control" type="textarea" placeholder="Your Greeting Text Here" value={this.state.message} onChange={this.handleMessageChange}/>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                        <input type="submit" className="btn btn-primary" value="Add"/>
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

var DeleteServiceForm = React.createClass({
    getInitialState: function() {
        return {service_id: ''};
    },
    handleServiceChange: function(e) {
        this.setState({service_id: e.target.value});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var service = this.state.service_id.trim();
        if (!service) {
            return;
        }
        this.props.onServiceDelete({service_id: service});
        this.props.refreshOnDelete();
    },

    render: function() {
        return (
            <div>
                <button type="button" className="btn btn-danger pull-right glyphicon glyphicon-trash" data-toggle="modal" data-target="#serviceDeleteModal">
                    <span className="btn-icon-text">Delete Service</span>
                </button>
                <div className="modal fade" id="serviceDeleteModal" tabIndex="-1" role="dialog" aria-labelledby="serviceDeleteModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content modal-one">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">
                                    <span aria-hidden="true">&times;</span>
                                    <span className="sr-only">Close</span>
                                </button>
                                <h4 className="modal-title glyphicon glyphicon-trash" id="serviceDeleteModalLabel">
                                    <span className="btn-icon-text">Delete Service</span>
                                </h4>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group select-width">
                                        <select className="form-control" onChange={this.handleServiceChange} required="true">
                                            <option value="" defaultValue>Select service</option>
                                            {this.props.data.map(function(service) {
                                                return (
                                                    <option key={service.id} value={service.id}>{service.service_name}: {service.service_number}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                        <input type="submit" className="btn btn-danger pull-right" value="Delete"/>
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
    <ServicesBox url="/api/v1/services" pollInterval={5000}/>, document.getElementById('serviceBox'));
