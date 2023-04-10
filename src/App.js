import React, { Component } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';

export default class App extends Component {
    static displayName = App.name;

    constructor(props) {
        super(props);
        this.state = { emailValue:'',isValidEmail:true, isValidSubscribe:true, isValidUnsubscribe:true};
    }



    async handleClickedEvent(event) {
        this.setState({ ['isValidEmail']: true })
        this.setState({ ['isValidSubscribe']: true })
        this.setState({ ['isValidUnsubscribe']: true })
        event.preventDefault();
        console.log(this.state.emailValue)

        await this.validateEmail(this.state.emailValue,event)
    }


    onChangeInput(event) {
        event.preventDefault();
        const { name, value } = event.target
        this.setState({[name]: value })
    }


    render() {
        return (
            <div>
            <h1>Subscribe to receive Newsletters!</h1>
                <Form>
                    <Form.Label style={{ color: '#01295F', fontWeight: 'bold' }}>Email: </Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter Email"
                        name='emailValue'
                        value={this.state.emailValue}
                        onChange={(e) => this.onChangeInput(e)}
                        required
                    />
                    <> : </>
                    <Button type="submit" onClick={(e) => this.handleClickedEvent(e)}>Subscribe</Button>
                    <> | </>
                    <Button type="submit" onClick={(e) => this.handleClickedEvent(e)}>Unsubscribe</Button>
                    <Form.Control.Feedback type='invalid' style={{ color: 'red' }} hidden={this.state.isValidEmail}>
                        Email is Invalid.
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type='invalid' style={{ color: 'red' }} hidden={this.state.isValidSubscribe}>
                        This Email has already been Subscribed to Newsletters.
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type='invalid' style={{ color: 'red' }} hidden={this.state.isValidUnsubscribe}>
                        This Email has already been Unsubscribed from Newsletters.
                    </Form.Control.Feedback>

                </Form>
            </div>
        );
    }


    async validateEmail(email,event) {

        if (email === '') {
            this.setState({ ['isValidEmail']: false })
            return 
        }

        axios.get(`https://localhost:7236/Newsletters/ValidateEmail?email=${email}`)
            .then((resp) => {
                const isValid = resp.data
                if (isValid === true) {
                    this.setState({ ['isValidEmail']: true })

                    if (event.target.innerText === "Subscribe") {
                        this.subscribe(email)
                    }
                    else {
                        this.unsubscribe(email)
                    }
                }
                else {
                    this.setState({ ['isValidEmail']: false })
                }
            })
            .catch(() => {
                this.setState({ ['isValidEmail']: false })
            })
    }


    async unsubscribe(email) {
        axios.get(`https://localhost:7236/Newsletters/Unsubscribe?email=${email}`)
            .then(() => {
                console.log("Is Unsubscibed")
                window.alert("Email removed from Newsletter Mailing List.")
            })
            .catch(() => {
                this.setState({ ['isValidUnsubscribe']: false })
            })
    }
    

    async subscribe(email) {
        axios.get(`https://localhost:7236/Newsletters/Subscribe?email=${email}`)
            .then(() => {
                console.log("Is Subscribed")
                window.alert("Email added to Newsletter Mailing List.")
            })
            .catch(() => {
                this.setState({ ['isValidSubscribe']: false })
            })
    }

}
