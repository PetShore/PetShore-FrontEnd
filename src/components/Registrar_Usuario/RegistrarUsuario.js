import React, { Component } from 'react';
import { Avatar, Button, CssBaseline, FormControl, Paper, Typography, TextField} from '@material-ui/core/';
import LockIcon from '@material-ui/icons/LockOutlined';
import './Registrar.css'
import Swal from 'sweetalert2';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';

class RegistrarUsuario extends Component {
  constructor(props) {
    super(props);
    this.state = { url: 'https://petshore-backend.herokuapp.com/', confirmReister: true, user: '', email: '', neigborhood: '', address: '', password: '', confirmPassword: '' }
    this.handleUser = this.handleUser.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handleNeighborhood = this.handleNeighborhood.bind(this);
    this.handleAddress = this.handleAddress.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleConfirmPassword = this.handleConfirmPassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  render() {
    document.body.classList.add('registrar');
    return (
      <React.Fragment >
        <CssBaseline />
        <div className="layout registrar">
          <Paper className="paper registrar">
            <Avatar className="avatar registrar">
              <LockIcon />
            </Avatar>
            <Typography variant="h4">CREA TU CUENTA</Typography>
            <form className="form registrar" >
              <FormControl margin="normal" required fullWidth>
                <TextField id="user" name="user" label="Usuario" required onChange={this.handleUser} autoComplete="user" autoFocus />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <TextField id="email" name="email" label="Correo" required onChange={this.handleEmail} autoComplete="email" autoFocus />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <TextField id="neigborhood" name="neigborhood" label="Barrio" required onChange={this.handleNeighborhood} autoComplete="neigborhood" autoFocus />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <TextField name="address" id="address" required label="Dirección" onChange={this.handleAddress} autoComplete="current-password" />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <TextField name="password" type="password" id="password" label="Contraseña" required onChange={this.handlePassword} autoComplete="current-password" />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <TextField name="confirmPassword" type="password" label="Confimar Contraseña" id="confirmPassword" required onChange={this.handleConfirmPassword} autoComplete="current-password" />
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
      </React.Fragment>
    );
  }

  onSubmit = () => {
    const { history } = this.props;
    history.push('/login');
  }

  handleUser(e) {
    this.setState({
      user: e.target.value
    });
  }
  handleEmail(e) {
    this.setState({
      email: e.target.value
    });
  }
  handleNeighborhood(e) {
    this.setState({
      neigborhood: e.target.value
    });
  }
  handleAddress(e) {
    this.setState({
      address: e.target.value
    });
  }
  handlePassword(e) {
    this.setState({
      password: e.target.value
    });
  }
  handleConfirmPassword(e) {
    this.setState({
      confirmPassword: e.target.value
    });
  }
  async handleSubmit(e) {
    const { history } = this.props;
    this.setState({ confirmReister: false });
    var f = "@";
    console.log(this.state.email);
    e.preventDefault();
    if (!this.state.email ||!this.state.user || !this.state.neigborhood || !this.state.address|| !this.state.confirmPassword || !this.state.password) {
      Swal.fire("Algún espacio está vacío", "Por favor llene todos los campos", "error");
    } else if (!this.state.email.includes(f)) {
      Swal.fire("El correo no corresponde con uno real.", "Por favor ingrese un correo válido.", "error");
      return;
    } else if (this.state.password !== this.state.confirmPassword) {
      Swal.fire("Las contraseñas ingresadas no coinciden.", "Por favor ingrese de nuevo las contraseñas.", "error");
      return;
    } else {
      await axios.post(this.state.url+'auth/addUser', {
        username: this.state.user,
        nombreCompleto: this.state.user,
        email: this.state.email,
        barrio: this.state.neigborhood,
        password: this.state.password,
        direccionResidencia: this.state.address,
        numero: '',
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

      return;
    }
    this.setState({ confirmReister: true });
  }
}
export default RegistrarUsuario;
