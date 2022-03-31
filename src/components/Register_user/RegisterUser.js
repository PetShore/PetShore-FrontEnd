import React, { Component } from 'react';
import { Avatar, Button, CssBaseline, FormControl, Paper, Typography, TextField } from '@material-ui/core/';
import LockIcon from '@material-ui/icons/LockOutlined';
import './Register.css'
import Swal from 'sweetalert2';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';

class RegisterUser extends Component {
  constructor(props) {
    super(props);
    this.state = { url: 'https://petshore-backend.herokuapp.com/', confirmReister: true, user: '', email: '', university: '', address: '', number: '', password: '', confirmPassword: '' }
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  render() {
    document.body.classList.add('registrar');
    return (
      <React.Fragment >
        <Box m="auto">
        <CssBaseline />
        <div className="layout registrar">
          <Paper className="paper registrar">
            <Avatar className="avatar registrar">
              <LockIcon />
            </Avatar>
            <Typography variant="h4">CREA TU CUENTA</Typography>
            <form className="form registrar" >
              <FormControl margin="normal" required fullWidth>
                <TextField id="user" name="user" label="Usuario" required value={this.state.user} onChange={this.handleAll} autoComplete="user" autoFocus />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <TextField id="email" name="email" label="Correo" required value={this.state.email} onChange={this.handleAll} autoComplete="email" autoFocus />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <TextField id="university" name="university" label="Barrio" value={this.state.university} required onChange={this.handleAll} autoComplete="university" autoFocus />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <TextField name="address" id="address" required label="Dirección" value={this.state.address} onChange={this.handleAll} autoComplete="current-password" />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <TextField name="number" type="number" id="number" required label="Numero de celular" value={this.state.number} onChange={this.handleAll} autoComplete="current-number" />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <TextField name="password" type="password" id="password" label="Contraseña" required value={this.state.password} onChange={this.handleAll} autoComplete="current-password" />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <TextField name="confirmPassword" type="password" label="Confimar Contraseña" id="confirmPassword" required value={this.state.confirmPassword} onChange={this.handleAll} autoComplete="current-password" />
              </FormControl>
              {this.state.confirmReister ?
                <Button onClick={this.handleSubmit} fullWidth variant="contained" color="primary" className="submit registrar">
                  Registrar
                </Button>
                :
                <div><CircularProgress /></div>
              }
            </form>
          </Paper>
        </div>
        </Box>
      </React.Fragment>
    );
  }

  onSubmit = () => {
    const { history } = this.props;
    history.push('/login');
  }

  handleAll = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  async handleSubmit(e) {
    const { history } = this.props;
    this.setState({ confirmReister: false });
    var f = "@";
    console.log(this.state.email);
    e.preventDefault();
    if (!this.state.email || !this.state.user || !this.state.university || !this.state.address || !this.state.confirmPassword || !this.state.password || !this.state.number) {
      Swal.fire("Algún espacio esta vacio", "Por favor llene todos los campos", "error");
    } else if (!this.state.email.includes(f)) {
      Swal.fire("El correo no corresponde con uno institucional.", "Por favor ingrese un correo institucional.", "error");
    } else if (this.state.password !== this.state.confirmPassword) {
      Swal.fire("Las contraseñas ingresadas no coinciden.", "Por favor ingrese de nuevo las contraseñas.", "error");
    } else {
      await axios.post(this.state.url + 'auth/addUser', {
        username: this.state.user,
        nombreCompleto: this.state.user,
        email: this.state.email,
        barrio: this.state.university,
        password: this.state.password,
        direccionResidencia: this.state.address,
        numero: this.state.number,
        carros: [],
        viajesConductor: [],
        viajesPasajero: []
      },
      )
        .then(async function (response) {
          console.log(response.status);
          console.log(response.data);
          if (response.status === 200) {
            await Swal.fire(
              '¡Cuenta creada satisfactoriamente!',
              'Será redireccionado a la página de inicio de sesión',
              'success'
            )

            history.push('/login');
          } else {
            Swal.fire("Signup failed!", "try again later", "error");
          }

        })
        .catch(function (error) {
          console.log(error);
        });
    }
    this.setState({ confirmReister: true });
  }
}
export default RegisterUser;
