import { Button, Container, TextField, Typography, InputLabel, FormControl, OutlinedInput, IconButton, InputAdornment, FormHelperText} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { Component } from 'react';
import { withStyles } from '@material-ui/core';
import apiClient from '../../services/klaiaServices';
import { Alert } from '@material-ui/lab';

import styles from './styleLogin'

class Login extends Component {
    state = {
        email: {
            value: '',
            error: ''
        },
        password: {
            value: '',
            error: ''
        },
        errorMessage: '',
        showPasswordSymbols: false,
        newSingInLoading: false
    }
    
    checkEmail = (email) => {
        const checkParams = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;//eslint-disable-line
        return checkParams.test(String(email).toLowerCase());
    }

    postData = async () => {
        try {
            const res = await apiClient.post("/user/sessions", {
            session:{
                platform_type: 'web'
            },email: this.state.email.value, password: this.state.password.value});
            }
        catch (error) {
            this.setState({
                newSingInLoading:false,
                errorMessage: error.response.data.error.message
            })
            }
    }

    clearErrors = () => {
        let email = this.state.email;
        let password = this.state.password;
        email.error = '';
        password.error = '';
        this.setState({
            errorMessage: '',
            email,
            password
        })
    }

    singIn = (e) => {
        e.preventDefault();
        this.clearErrors();
        let hasError = false;

        if (!this.checkEmail(this.state.email.value)) {
            hasError = true;
            let email = this.state.email;
            email.error = "Invalid email";
            this.setState({email});
        } 
        if (this.state.password.value.length < 5) {
            hasError = true
            let password = this.state.password;
            password.error = "Password cannot be empty or <5 characters";
            this.setState({password});
        } 
        if (hasError) return;

        this.setState({
            newSingInLoading: true
        })
        this.postData();
    }

    handleClickShowPassword = () => {
        this.setState({
            showPasswordSymbols: !this.state.showPasswordSymbols
        })
    }    
    
    render() {
        const { classes } = this.props;
    
        return(
            <Container maxWidth="sm"  className={classes.container}>
            <form className={classes.form} onSubmit={(e) => this.singIn(e)}>
            <Typography className={classes.textLogo} variant="h1">klaia</Typography>
                <TextField 
                    className={classes.textField}
                    autoFocus
                    id="email" 
                    label="Email" 
                    variant="outlined" 
                    type="email"
                    value={this.state.email.value}
                    onChange={(e) => {
                        let email = this.state.email;
                        email.value = e.target.value;
                        this.setState({email});
                    }}
                    error={this.state.email.error}
                    helperText={this.state.email.error}
                />
                <FormControl  className={classes.textField} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={this.state.showPasswordSymbols ? 'text' : 'password'}
                        value={this.state.password.value}
                        onChange={(e) => {
                            let password = this.state.password;
                            password.value = e.target.value;
                            this.setState({password});
                        }}
                        label="Password"
                        error={this.state.password.error}
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={this.handleClickShowPassword}
                            edge="end"
                            >
                            {this.state.showPasswordSymbols ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                        }            
                    />
                    <FormHelperText className={classes.formHelperText} id="outlined-weight-helper-text">{this.state.password.error}</FormHelperText>
                </FormControl >
                <Button type="Submit" disabled={this.state.newSingInLoading}  size='large' className={classes.signInButton} variant="contained">Sign In</Button>
                {this.state.errorMessage && <Alert className={classes.alert} severity="error">{this.state.errorMessage}</Alert>}
            </form>
        </Container>
        )
    }
}

export default withStyles(styles)(Login);




