const handleDomo = (e, csrf) => {
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoFood").val() == '') {
        handleError("RAWR: All fields are required.");
        return false;
    };

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
        loadDomosFromServer(csrf);
    });

    return false;
};

const handleDomoDelete = (e, formID, csrf) => {
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    sendAjax('POST', $(formID).attr("action"), $(formID).serialize(), function () {
        loadDomosFromServer(csrf);
    });

    return false;
};

const DomoForm = props => {
    return React.createElement(
        "form",
        { id: "domoForm", name: "domoForm",
            onSubmit: e => handleDomo(e, props.csrf),
            action: "/maker",
            method: "POST",
            className: "domoForm"
        },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Name: "
        ),
        React.createElement("input", { id: "domoName", type: "text", name: "name", placeholder: "Domo Name" }),
        React.createElement(
            "label",
            { htmlFor: "food" },
            "Food: "
        ),
        React.createElement("input", { id: "domoFood", type: "text", name: "food", placeholder: "Domo Favorite Food" }),
        React.createElement(
            "label",
            { htmlFor: "age" },
            "Age: "
        ),
        React.createElement("input", { id: "domoAge", type: "text", name: "age", placeholder: "Domo Age" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Make Domo" })
    );
};

const DomoDelete = function (props) {
    return React.createElement(
        "form",
        { id: `domoDelete-${props._id}`,
            name: `domoDelete-${props._id}`,
            onSubmit: e => handleDomoDelete(e, `#domoDelete-${props._id}`, props.csrf),
            action: "/delete",
            method: "POST",
            className: "domoDelete" },
        React.createElement("input", { type: "hidden", id: props._id, name: "_id", value: props._id }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "deleteDomoSubmit", type: "submit", value: "Delete Domo" })
    );
};

const DomoList = function (props) {
    if (props.domos.length === 0) {
        return React.createElement(
            "div",
            { className: "domoList" },
            React.createElement(
                "h3",
                { className: "emptyDomo" },
                "No Domos yet"
            )
        );
    }

    const domoNodes = props.domos.map(function (domo) {
        return React.createElement(
            "div",
            { key: domo._id, className: "domo" },
            React.createElement("img", { src: "/assets/img/domoFace.jpeg", alt: "domo face", className: "domoFace" }),
            React.createElement(
                "h3",
                { className: "domoName" },
                "Name: ",
                domo.name
            ),
            React.createElement(
                "h3",
                { className: "domoFood" },
                "Favorite Food: ",
                domo.food
            ),
            React.createElement(
                "h3",
                { className: "domoAge" },
                "Age: ",
                domo.age
            ),
            React.createElement(DomoDelete, { _id: domo._id, csrf: props.csrf })
        );
    });

    return React.createElement(
        "div",
        { className: "domoList" },
        domoNodes
    );
};

const loadDomosFromServer = csrf => {
    sendAjax('GET', '/getDomos', null, data => {
        ReactDOM.render(React.createElement(DomoList, { domos: data.domos, csrf: csrf }), document.querySelector("#domos"));
    });
};

const setup = function (csrf) {
    ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));

    ReactDOM.render(React.createElement(DomoList, { domos: [], csrf: csrf }), document.querySelector("#domos"));

    loadDomosFromServer(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, result => {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
const handleError = message => {
    $("#errorMessage").text(message);
    $("#domoMessage").animate({ width: 'toggle' }, 350);
};

const redirect = response => {
    $("#domoMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: 'json',
        success: success,
        error: function (xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
