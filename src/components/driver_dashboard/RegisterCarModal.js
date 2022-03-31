import React, { Component } from 'react';
import './RegisterCarModal.css';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import axios from 'axios';
import Swal from 'sweetalert2';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { withStyles } from "@material-ui/core/styles";

import CircularProgress from '@material-ui/core/CircularProgress';

class RegisterCarModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loadbrands: true,
      productRegister: true,
      id: '', 
      nombre: '', 
      descripcion: '', 
      precio: '',
      categoria: '',
      categorias: [
        { categoria: 'PERROS', id: "1" },
        { categoria: 'GATOS', id: "2" },
        { categoria: 'AVES', id: "3" },
        { categoria: 'ROEDORES', id: "4" },
        { categoria: 'OTROS', id: "5" }]

    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (e) => {

    this.setState({ [e.target.name]: e.target.value });

  }

  handleChangeSelect = (e) => {

    this.setState( {categoria: e.target.value});
    
  }


  async handleSubmit() {
    this.setState({ productRegister: false });
    // falta hacer validaciones de campos vacios
    console.log(this.state.id);
    console.log(this.state.nombre);
    console.log(this.state.precio);
    console.log(this.state.descripcion);
    console.log(this.state.categoria);
    if (!(this.state.id &&
      this.state.nombre &&
      this.state.precio &&
      this.state.descripcion &&
      this.state.categoria)) {
      await Swal.fire(
        'Hay Campos Vacios ',
        'Llene todos los campos por favor ',
        'error'
      )
      this.setState({ productRegister: true });
    } else {
      // sacar user token y username de localEstorage
      var userInfo = JSON.parse(localStorage.getItem('user'));
      // hacer el post
      await axios.post(`https://petshore-backend.herokuapp.com/petshore/product/add/` + userInfo.username,
        {
          codigoId: this.state.id,
          nombre: this.state.nombre,
          precio: this.state.precio,
          descripcion: this.state.descripcion,
          disponible: true,
          categoria: this.state.categoria,
        },
        {
          headers: {
            Authorization: userInfo.token //the token is a variable which holds the token
          }
        }
      )
        .then(res => {
          console.log("code api: ",res.status)
          if (res.status === 201) {
            Swal.fire(
              'Registro Exitoso',
              'Su producto ha sido registrado exitosamente',
              'success'
            )
            this.setState({ productRegister: true });
          } else if (res.status === 226) {
            Swal.fire(
              'Registro Fallido',
              'Ya existe un Id asignado a ese producto',
              'error'
            )
            this.setState({ productRegister: true });
          }  else {
            Swal.fire(
              'Registro Fallido',
              'Error del servidor, vuelva a registrarlo',
              'error'
            )
            this.setState({ productRegister: true });
          }
        }).catch(async function () {
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

        })
    }

  }

  render() {

    const { classes } = this.props;


    return (
      <Box m="auto">
        <Box m="auto">
          <Typography color='initial' variant="h2">
            <strong>Registra Tu Producto</strong>
          </Typography>
        </Box>
        <p>
        <p>
            <FormControl variant="filled" >
              <TextField
                id="standard-basic"
                label="Codigo"
                name="id"
                value={this.state.id}
                onChange={this.handleChange}
              />
            </FormControl>
          </p>
          <p>
            <FormControl variant="filled" >
              <TextField
                id="standard-basic"
                label="Nombre"
                name="nombre"
                value={this.state.nombre}
                onChange={this.handleChange}
              />
            </FormControl>
          </p>
          <p>
            <FormControl variant="filled" >
              <TextField
                id="standard-basic"
                label="Descripcion"
                name="descripcion"
                value={this.state.descripción}
                onChange={this.handleChange}
              />
            </FormControl>
          </p>
          
        </p>

        <p>
            <FormControl variant="filled" >
              <TextField
                id="standard-basic"
                label="Precio"
                name="precio"
                value={this.state.precio}
                onChange={this.handleChange}
              />
            </FormControl>
          </p>
        <p>
          <FormControl variant="outlined" className={classes.formControl} >
            <InputLabel width="200px" id="demo-simple-select-outlined-label">Categoria:</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              value={this.state.categoria}
              onChange={this.handleChangeSelect}
              label="Categoria animal"
            >
              {this.state.categorias.map((option) => <MenuItem key={option.id} value={option.categoria}>{option.categoria}</MenuItem>)}
            </Select>
          </FormControl> 
        </p>

        {this.state.productRegister ?
          <Button onClick={() => { this.handleSubmit() }} variant="outlined" color="primary">
            Registrar
          </Button>
          :
          <div >
            <CircularProgress />
          </div>
        }

      </Box>)
  };


}


const styles = theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
});


export default withStyles(styles, { withTheme: true })(RegisterCarModal);
