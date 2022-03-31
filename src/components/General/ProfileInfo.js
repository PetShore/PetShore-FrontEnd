import React, { Component } from 'react';

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import ReactStars from "react-rating-stars-component";
import Grid from '@material-ui/core/Grid';
import Swal from 'sweetalert2';
import { withStyles } from "@material-ui/core/styles";
import clsx from 'clsx';
import { Box } from '@material-ui/core'

import Button from '@material-ui/core/Button';

import axios from 'axios';

class ProfileInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: true,
      edit: false,
      showPassword: false,
      number: '',
      name: '',
      email: '',
      rating: 0,
      password: '',
      confirPass: '',
      direction: '',
    }
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleOpen() {
    this.setState({ open: true });
  };

  handleClose() {
    this.setState({ open: false });
  };

  handleEdit() {
    this.setState({ edit: !this.state.edit });
  }

  handleField = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  }

  cancel = () => {
    this.setState({ open: false });
  }

  async handleSave() {
    var f = "@";
    var witheSpace = true;
    var emailWrong = true;
    var passWrong = true;

    if (this.state.name !== "" &&
      this.state.email !== "" &&
      this.state.direction !== "") {
      witheSpace = false;
    }
    if (this.state.email.includes(f)) {
      emailWrong = false;
    }
    if (this.state.password === this.state.confirPass) {
      passWrong = false;
    }

    if (!witheSpace && !emailWrong && !passWrong) {
      // sacar user token y username de localEstorage
      var userInfo = JSON.parse(localStorage.getItem('user'));
      // hacer el put
      await axios.put(`https://petshore-backend.herokuapp.com/petshore/user/update`,
        {
          username: userInfo.username,
          nombreCompleto: this.state.name,
          direccionResidencia: this.state.direction,
          email: this.state.email,
          numero: this.state.number,
          password: this.state.password ? this.state.password : null
        },
        {
          headers: {
            Authorization: userInfo.token //the token is a variable which holds the token
          }
        }
      )
        .then(res => {
          if (res.status === 200) {
            Swal.fire(
              'Cuenta editada satisfactoriamente!',
              'edicion terminada',
              'success'
            )
            this.setState({ open: false });
          } else {
            Swal.fire(
              'Registro Fallido',
              'error del servidor, vuelva a intentarlo',
              'error'
            )
            this.setState({ open: false });
          }
        }).catch(async error => {
          console.log(error);
          this.setState({ open: false });
          await Swal.fire(
            'sesion finalizada',
            'error del servidor, vuelva a loguearse',
            'error'
          )
          //clear local estorage
          localStorage.clear();
          // redireccionar a login
          window.location.replace("/login")
        });
      this.setState({ open: false });
    }
  }

  async componentDidMount() {
    //Traer info del api getUser
    // sacar info usuario localestorage
    var userLocalestorage = await JSON.parse(localStorage.getItem('user'));
    this.setState({ userInfo: userLocalestorage })

    // sacar usuario si es valido, si no redirigirlo al login
    await axios.get(`https://petshore-backend.herokuapp.com/auth/loggedUser/` + userLocalestorage.username,
      {
        headers: {
          Authorization: userLocalestorage.token //the token is a variable which holds the token
        }
      }
    )
      .then(res => {
        const user = res.data;
        this.setState({ name: user.nombreCompleto });
        this.setState({ email: user.email });
        this.setState({ direction: user.direccionResidencia });
        this.setState({ number: user.numero });
      })
      .catch(async function () {
        // aqui entra cuando el token es erroneo, toca pedirle que vuelva a loguearse
        await Swal.fire(
          'Sesion Finalizada',
          'Vuelva a loguearse',
          'error'
        )
        //clear local estorage
        localStorage.clear();
        // redireccionar a login
        window.location.replace("/login")
      });
    //

  }

  render() {
    const { classes } = this.props;
    return (
      <Box m="auto">
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={this.state.open}
          onClose={this.handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >

          <Fade in={this.state.open}>
            <center>
              <Box m="auto">
                <div className={classes.paper}>
                  <Grid container>
                    <Grid item xs={12} sm={6}>
                      <h2 id="transition-modal-title">Nombre: </h2>
                      {!this.state.edit ? this.state.name :
                        <TextField
                          variant="outlined"
                          id="name"
                          name="name"
                          label="Nombre"
                          type="text"
                          error={this.state.name === ""}
                          helperText={this.state.name === "" && "Error el nombre está vacío"}
                          value={this.state.name}
                          onChange={this.handleField}
                          autoFocus
                          required />}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <h2 id="transition-modal-descriptionmail">Correo: </h2>
                      {!this.state.edit ? this.state.email :
                        <TextField
                          variant="outlined"
                          id="email"
                          name="email"
                          label="Correo"
                          type="text"
                          error={this.state.email === "" || !this.state.email.includes("@")}
                          helperText={this.state.email === "" ? "Error el correo está vacío" : !this.state.email.includes("@") ? "Error el correo no es válido" : null}
                          value={this.state.email}
                          onChange={this.handleField}
                          autoFocus
                          required />}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <h2 id="transition-modal-titlenumero">Numero: </h2>
                      {!this.state.edit ? this.state.number :
                        <TextField
                          variant="outlined"
                          name="number"
                          id="numero"
                          label="Numero"
                          type="number"
                          error={this.state.number === ""}
                          helperText={this.state.number === "" && "Error el numero está vacío"}
                          value={this.state.number}
                          onChange={this.handleField}
                          autoFocus
                          required />}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <h2 id="transition-modal-titledirection">Dirección: </h2>
                      {!this.state.edit ? this.state.direction :
                        <TextField
                          variant="outlined"
                          name="direction"
                          id="direction"
                          label="Dirección"
                          type="text"
                          error={this.state.direction === ""}
                          helperText={this.state.direction === "" && "Error la dirección está vacía"}
                          value={this.state.direction}
                          onChange={this.handleField}
                          autoFocus
                          required />}
                    </Grid>
                    {this.state.edit &&
                      <React.Fragment>
                        <Grid container spacing={0}>
                          <Grid item xs={12} sm={6}>
                            <h2 id="transition-modal-descriptionpassword">Contraseña: </h2>

                            <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">

                              <TextField
                                variant="outlined"
                                label="Password"
                                id="outlined-adornment-password-login"
                                error={this.state.password !== this.state.confirPass}
                                helperText={this.state.password !== this.state.confirPass ? "Error la contraseña no coincide con la confirmada" : "no ingresar nada si no la va a cambiar"}
                                type={this.state.showPassword ? 'text' : 'password'}
                                value={this.state.password}
                                name="password"
                                autoComplete="off"
                                onChange={this.handleField}

                                endAdornment={
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={this.handleClickShowPassword}
                                      onMouseDown={this.handleMouseDownPassword}
                                      edge="end"
                                    >
                                      {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                  </InputAdornment>
                                }
                              />
                            </FormControl>

                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <h2 id="transition-modal-descriptionconfirPass">Confirmar Contraseña: </h2>

                            <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
                              <InputLabel htmlFor="outlined-adornment-password">Confirmar Contraseña</InputLabel>
                              <OutlinedInput label="Password"
                                id="outlined-adornment-password-loginf"
                                type={this.state.showPassword ? 'text' : 'password'}
                                value={this.state.confirPass}
                                name="confirPass"
                                autoComplete="off"
                                onChange={this.handleField}

                                endAdornment={
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={this.handleClickShowPassword}
                                      onMouseDown={this.handleMouseDownPassword}
                                      edge="end"
                                    >
                                      {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                  </InputAdornment>
                                }
                              />
                            </FormControl>

                          </Grid>
                          <Box m="auto">
                            <Box m="auto">

                              <tr>
                                <th>
                                  <Button type="submit" color="primary" variant="contained" onClick={this.handleSave}>
                                    Guardar
                                  </Button>
                                </th>
                                <th>
                                  <Button type="submit" color="secondary" variant="contained" onClick={this.cancel}>
                                    Cancelar
                              </Button>
                                </th>
                              </tr>


                            </Box>
                          </Box>

                        </Grid>
                      </React.Fragment>

                    }

                    {!this.state.edit &&
                      <Box m="auto">

                        <h2 id="transition-modal-calificacion">Calificación: </h2>
                        <Box m="auto">
                          <ReactStars
                            value={this.state.rating}
                            size={24}
                            color="#AFAFAF"
                            activeColor="#ffd700"
                            edit={false}
                          />
                        </Box>


                        <Button color="primary" variant="contained" className={classes.button} onClick={this.handleEdit}>
                          Editar
                        </Button>
                      </Box>
                    }
                  </Grid>
                </div>
              </Box>
            </center>

          </Fade>

        </Modal>

      </Box>

    )
  }
}

const styles = theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(1, 1, 1),
  },
  h3: {

  },
  margin: {
    margin: theme.spacing(0),
  },
  textField: {
    marginTop: theme.spacing(0),
  },
  button: {
    alignItems: "center"
  }
});


export default withStyles(styles, { withTheme: true })(ProfileInfo);