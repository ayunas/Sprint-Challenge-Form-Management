import React from 'react';
import { Form, Field, withFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';


const formStyle = {
    display: "flex",
    flexDirection: "column",
    border: '1px solid green',
    alignItems: "center"
}

class Formy extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            registered: []
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.status !== this.props.status) {
            console.log('conditional checked');
            this.setState({ registered: this.props.status })
        }
    }

    showUsers = () => {
        console.log('show users triggered');
        axios.get('http://localhost:5000/api/users')
            .then(res => console.log('res.data', res.data))
            .catch(err => console.log(err));
    }

    render() {
        return (
            <React.Fragment>
                <Form style={formStyle} >
                    <Field type="text" name="username" placeholder="username" />
                    {this.props.touched.username && this.props.errors.username && <div>{this.props.errors.username}</div>}
                    <Field type="password" name="password" placeholder="password" />
                    {(this.props.touched.password && this.props.errors.password) && <div>{this.props.errors.password}</div>}
                    <button type="submit">Register</button>
                </Form>
                Users Registered :
                 {console.log('registered', this.state.registered)}
                {this.state.registered[1] && this.state.registered.map(user => <div>{user.username}</div>)}
                <button onClick={this.showUsers}>Display Registered Users</button>
            </React.Fragment>
        )
    }
}


const formikConfig = {
    mapPropsToValues: function (values) {
        return {
            username: values.username || '',
            password: values.password || ''
        };
    },
    validationSchema: yup.object().shape({
        username: yup.string().required("username is a required field"),
        password: yup.string().min(4, "password must be > 10 characters").required("password required")
    }),
    handleSubmit: function (values, formikBag) {
        console.log("handleSubmit fired, %cvalues and formikBag", "color:red;", values, formikBag)
        // formikBag.setSubmitting(fase);  //why to do this?  
        formikBag.resetForm();
        axios.post('http://localhost:5000/api/register', values)
            .then(res => {
                console.log(res.data);
                formikBag.setStatus(values);
                window.localStorage.setItem('token', res.data.token);
            })
            .catch(err => console.error(err.message));

    }
}

const FormikyForm = withFormik(formikConfig)(Formy);


export default FormikyForm;

        // fetch('http://localhost:5000/api/register', {headers : {"Content-Type": "application/json",                                                                        "Access-Control-Allow-Origin": 'http://localhost:3000'},
        //                                             method : "post",
        //                                             mode : 'cors',
        //                                             body : {username : "harold", password: "kumar"}})
        // .then(res => res.json())
        // .then(data => console.log(data))
        // .catch(err => console.error(err.message))