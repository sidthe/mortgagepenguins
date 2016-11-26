var CallLogs = React.createClass({
    loadLogsFromServer: function() {
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

    getInitialState: function() {
        return {data: []};
    },

    componentDidMount: function() {
        this.loadLogsFromServer();
        setInterval(this.loadLogsFromServer, this.props.pollInterval);
    },

    render: function() {
        return (
            <div className="callLogs">
                <CallList data={this.state.data}/>
            </div>
        );
    }
});

var CallList = React.createClass({

    render: function() {
        return (
            <div className="callList">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Service Number</th>
                            <th>Caller</th>
                            <th>Supplier</th>
                            <th>Start Time (UTC)</th>
                            <th>Duration</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.data.map(function(calls) {
                            return (
                                <tr key={calls.id}>
                                    <td>{calls.service_number}</td>
                                    <td>{calls.caller_number}</td>
                                    <td>{calls.supplier_number}</td>
                                    <td>{calls.call_date}</td>
                                    <td>{calls.call_duration} sec</td>
                                    <td>{calls.call_status}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
});

ReactDOM.render(<CallLogs url="/api/v1/calls" pollInterval={10000}/>, document.getElementById('callList'));
