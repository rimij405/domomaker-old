const handleDomo = (e, csrf) => {
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();

    $("#domoMessage").animate({width:'hide'}, 350);

    if($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoFood").val() == ''){
        handleError("RAWR: All fields are required.");
        return false;
    };

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        loadDomosFromServer(csrf);
    });

    return false;
};

const handleDomoDelete = (e, formID, csrf) => {
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();

    $("#domoMessage").animate({width:'hide'}, 350);

    sendAjax('POST', $(formID).attr("action"), $(formID).serialize(), function() {
        loadDomosFromServer(csrf);
    });
    
    return false;
};

const DomoForm = (props) => {
    return(
        <form id="domoForm" name="domoForm"
                onSubmit={ e => handleDomo(e, props.csrf) }
                action="/maker"
                method="POST"
                className="domoForm"
                >
                <label htmlFor="name">Name: </label>
                <input id="domoName" type="text" name="name" placeholder="Domo Name" />
                <label htmlFor="food">Food: </label>
                <input id="domoFood" type="text" name="food" placeholder="Domo Favorite Food" />
                <label htmlFor="age">Age: </label>        
                <input id="domoAge" type="text" name="age" placeholder="Domo Age" />
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
};

const DomoDelete = function(props) {
    return(
        <form id={`domoDelete-${props._id}`}
            name={`domoDelete-${props._id}`}
            onSubmit={e => handleDomoDelete(e, `#domoDelete-${props._id}`, props.csrf) }
            action="/delete"
            method="POST"
            className="domoDelete">
            <input type="hidden" id={props._id} name="_id" value={props._id} />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="deleteDomoSubmit" type="submit" value="Delete Domo" /> 
        </form>
    );
};

const DomoList = function(props) {
    if(props.domos.length === 0) {
        return(
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(function(domo){
        return(
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoFace.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoFood">Favorite Food: {domo.food}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                <DomoDelete _id={domo._id} csrf={props.csrf} />
            </div>
        );
    });

    return(
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = (csrf) => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} csrf={csrf} />,
            document.querySelector("#domos")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <DomoForm csrf={csrf} />,
        document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <DomoList domos={[]} csrf={csrf} />,
        document.querySelector("#domos")
    );

    loadDomosFromServer(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function(){
    getToken();
});