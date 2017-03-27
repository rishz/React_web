import * as React from "react";
import * as ReactDOM from "react-dom";

class App extends React.Component{

    render(){ return(<div>
            <h1>Hello World Using React !</h1>
        </div>
    );
    }
}
var app = <App/>;

var node = document.getElementById("app");

ReactDOM.render(app,node);