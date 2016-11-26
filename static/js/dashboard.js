var DashboardWidgets = React.createClass({
    loadCallCountFromServer: function() {
        $.ajax({
            url: '/api/v1/calls/count',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({callcount: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error('/api/v1/calls/count', status, err.toString());
            }.bind(this)
        });
    },
    loadSuppliersCountFromServer: function() {
        $.ajax({
            url: '/api/v1/suppliers/count',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({supcount: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error('/api/v1/suppliers/count', status, err.toString());
            }.bind(this)
        });
    },
    loadServicesCountFromServer: function() {
        $.ajax({
            url: '/api/v1/services/count',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({sercount: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error('/api/v1/services/count', status, err.toString());
            }.bind(this)
        });
    },

    getInitialState: function() {
        return {callcount: [], supcount: [], sercount: []};
    },

    componentDidMount: function() {
        this.loadCallCountFromServer();
        this.loadSuppliersCountFromServer();
        this.loadServicesCountFromServer();
        setInterval(this.loadCallCountFromServer, this.props.pollInterval);
    },

    render: function() {
        return (
            <div>
                <div className="container col-md-4">
                    <dev className="row">
                        <h4 className="text-theme-gray text-center">
                            <span className="glyphicon glyphicon-dashboard"/> Number of Services
                        </h4>
                        <p className="text-theme-gray text-widget">
                            {this.state.sercount}
                        </p>
                    </dev>
                </div>
                <div className="container col-md-4">
                    <dev className="row">
                        <h4 className="text-theme-gray text-center">
                            <span className="glyphicon glyphicon-dashboard"/> Number of Suppliers
                        </h4>
                        <p className="text-theme-gray text-widget">
                            {this.state.supcount}
                        </p>
                    </dev>
                </div>
                <div className="container col-md-4">
                    <dev className="row">
                        <h4 className="text-theme-gray text-center">
                            <span className="glyphicon glyphicon-dashboard"/> Number of Calls
                        </h4>
                        <p className="text-theme-gray text-widget">
                            {this.state.callcount}
                        </p>
                    </dev>
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <DashboardWidgets pollInterval={10000}/>, document.getElementById('dashboard-content'));
