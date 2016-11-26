var SuppliersBox = React.createClass({
    loadSuppliersFromServer: function() {
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
    handleSupplierAdd: function(supplier) {
        var suppliers = this.state.data;
        supplier.id = Date.now() * 1000
        var newSupplier = suppliers.concat([supplier]);
        this.setState({data: newSupplier});
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: supplier,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleSupplierDelete: function(supplier) {
        this.setState({
            data: this.state.data.filter((i) => i.id != supplier.supplier_id)
        });
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'DELETE',
            data: supplier,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadServicesFromServer: function() {
        $.ajax({
            url: "/api/v1/services",
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({sdata: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error("/api/v1/services", status, err.toString());
            }.bind(this)
        });
    },

    getInitialState: function() {
        return {data: [], sdata: []};
    },

    componentDidMount: function() {
        this.loadSuppliersFromServer();
        this.loadServicesFromServer();
        setInterval(this.loadSuppliersFromServer, this.props.pollInterval);
        setInterval(this.loadServicesFromServer, this.props.pollInterval);
    },

    render: function() {
        return (
            <div className="supplierBox">
                <div className="container-edit-button">
                    <DeleteSupplierForm onSupplierDelete={this.handleSupplierDelete} refreshOnDelete={this.loadSuppliersFromServer} data={this.state.data}/>
                    <AddSupplierForm onSupplierAdd={this.handleSupplierAdd} serviceData={this.state.sdata}/>
                </div>
                <div className="container">
                    <SupplierList data={this.state.data} serviceData={this.state.sdata}/>
                </div>
            </div>
        );
    }
});

var SupplierList = React.createClass({

    sname: function(sid) {
        this.props.serviceData.map(function(service) {
            var serid;
            if (service.id == sid) {
                //                console.log(service.service_name)
                serid = service.service_name;
                return serid;
            }
        })
    },
    render: function() {
        var sup_name = this.sname
        return (
            <div className="supplierList">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Company Name</th>
                            <th>Service Name</th>
                            <th>Phone Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.data.map(function(supplier) {
                            return (
                                <tr key={supplier.id}>
                                    <td>{supplier.supplier_name}</td>
                                    <td>{sup_name(supplier.id)}</td>
                                    <td>{supplier.supplier_number}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
});

var AddSupplierForm = React.createClass({
    getInitialState: function() {
        return {supplier: '', phone: '', service: ''};
    },
    handleSupplierChange: function(e) {
        this.setState({supplier: e.target.value});
    },
    handlePhoneChange: function(e) {
        this.setState({phone: e.target.value});
    },
    handleServiceChange: function(e) {
        this.setState({service: e.target.value});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var supplier = this.state.supplier.trim();
        var phone = this.state.phone.trim();
        var service = this.state.service.trim();
        if (!supplier || !phone || !service) {
            return;
        }
        this.props.onSupplierAdd({supplier_name: supplier, supplier_number: phone, service_id: service});
        this.setState({supplier: '', phone: '', service: ''});
    },

    render: function() {
        return (
            <div>
                <button type="button" className="btn btn-primary pull-right btn-space glyphicon glyphicon-plus" data-toggle="modal" data-target="#supplierEditModal">
                        <span className="btn-icon-text">
                            Add Supplier</span>
                </button>
                <div className="modal fade modal-edit" id="supplierEditModal" tabIndex="-1" role="dialog" aria-labelledby="supplierEditModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content modal-three">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">
                                    <span aria-hidden="true">&times;</span>
                                    <span className="sr-only">Close</span>
                                </button>
                                <h4 className="modal-title glyphicon glyphicon-plus" id="supplierEditModalLabel">
                                        <span className="btn-icon-text">
                                            Add Supplier</span>
                                </h4>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group select-width">
                                        <input className="form-control" type="text" placeholder="Supplier Name" required="true" value={this.state.supplier} onChange={this.handleSupplierChange}/>
                                    </div>
                                    <div className="form-group select-width">
                                        <input className="form-control" type="text" placeholder="Phone Number" required="true" value={this.state.phone} onChange={this.handlePhoneChange}/>
                                    </div>
                                    <div className="form-group select-width">
                                        <select className="form-control" required="true" onChange={this.handleServiceChange}>
                                            <option value="" defaultValue>Select service</option>
                                            {this.props.serviceData.map(function(service) {
                                                return (
                                                    <option key={service.id} value={service.id}>{service.service_name}: {service.service_number}</option>
                                                )
                                            })}
                                        </select>
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

var DeleteSupplierForm = React.createClass({
    getInitialState: function() {
        return {supplier_id: ''};
    },
    handleSupplierChange: function(e) {
        this.setState({supplier_id: e.target.value});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var id = this.state.supplier_id.trim();
        if (!id) {
            return;
        }
        this.props.onSupplierDelete({supplier_id: id});
        this.props.refreshOnDelete();
    },

    render: function() {
        return (
            <div>
                <button type="button" className="btn btn-danger pull-right glyphicon glyphicon-trash" data-toggle="modal" data-target="#supplierDeleteModal">
                        <span className="btn-icon-text">
                            Delete Supplier</span>
                </button>
                <div className="modal fade" id="supplierDeleteModal" tabIndex="-1" role="dialog" aria-labelledby="supplierDeleteModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content modal-one">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">
                                    <span aria-hidden="true">&times;</span>
                                    <span className="sr-only">Close</span>
                                </button>
                                <h4 className="modal-title glyphicon glyphicon-trash" id="supplierDeleteModalLabel">
                                        <span className="btn-icon-text">
                                            Delete supplier</span>
                                </h4>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group select-width">
                                        <select className="form-control" onChange={this.handleSupplierChange}>
                                            <option value="" defaultValue>Select supplier</option>
                                            {this.props.data.map(function(supplier) {
                                                return (
                                                    <option key={supplier.id} value={supplier.id}>{supplier.supplier_name}</option>
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
    <SuppliersBox url="/api/v1/suppliers" pollInterval={5000}/>, document.getElementById('supplierBox'));
