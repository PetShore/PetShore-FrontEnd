import React, { Component } from 'react';

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Swal from 'sweetalert2';

import { withStyles} from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import axios from 'axios';

import CircularProgress from '@material-ui/core/CircularProgress';

class ActualizarCarro extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: false,
            open:true,
            car:this.props.car,
            marca: this.props.car.marca,
            modelo: this.props.car.modelo,
            color: this.props.car.color,
            placa: this.props.car.placa,
            editCarro: true,
            colores: [
                { color: 'Blanco', id: "#AAAAAA" },
                { color: 'Negro', id: "#000000" },
                { color: 'Azul', id: "#0032FF" },
                { color: 'Rojo', id: "#FF0000" },
                { color: 'Amarillo', id: "#FFFF00" },
                { color: 'Verde', id: "#008000" },
                { color: 'Naranja', id: "#FF4500" },
                { color: 'Morado', id: "#800080" }]
        }
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleMarca = this.handleMarca.bind(this);
        this.handleModelo = this.handleModelo.bind(this);
        this.handleColor = this.handleColor.bind(this);
        this.handlePlaca= this.handlePlaca.bind(this);
        this.handleEdit = this.handleEdit.bind(this);

    }

    handleOpen() {
        this.setState({ open: true });
    };

    handleClose() {
        this.setState({ open: false });
    };

    handleMarca(e){
        this.setState({ marca: e.target.value });
    }

    handleModelo(e){
        this.setState({ modelo: e.target.value });
    }
    handleColor(e){
        this.setState({ color: e.target.value });
    }
    handlePlaca(e){
        this.setState({ placa: e.target.value });
    }

    async handleEdit(){
        this.setState({ editCarro: false });
        if(this.state.marca!== "" && this.state.modelo !== "" && this.state.color !== "" && this.state.placa !== ""){
            // sacar user token y username de localEstorage
            var userInfo = JSON.parse(localStorage.getItem('user'));
            // hacer el put
            await axios.put(`https://petshore-backend.herokuapp.com/petshore/updateProduct/` + userInfo.username,
                {
                placa: this.state.placa,
                marca: this.state.marca,
                color: this.state.color,
                modelo: this.state.modelo
                },
                {
                headers: {
                    Authorization: userInfo.token //the token is a variable which holds the token
                }
                }
            )
            .then(res => {
                if (res.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Animalito editado con éxito!',
                        showConfirmButton: false,
                        timer: 2000
                      });
                  this.props.updateListCar(); 
                  this.setState({ open: false });
                  this.setState({ editCarro: true });
                } else {
                  Swal.fire(
                    'Registro Fallido',
                    'Error del servidor, vuelva a registrarlo',
                    'error'
                  )
                  this.setState({ open: false });
                }
            }).catch(function (error) {
                console.log(error);
                Swal.fire(
                    'Sesión finalizada',
                    'Error del servidor, vuelva a loguearse',
                    'error'
                )
                // redireccionar a login
                window.location.replace("/login")
            });
        }
        else{
            Swal.fire(
                'Datos Erróneos',
                'Verifique los campos',
                'error'
            )
            this.setState({ open: false });
        }

        this.setState({ editCarro: true });
      };
  

    render() {
        const { classes } = this.props;

        return (
            <div>
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
                        <div className={classes.paper}>
                            <FormControl variant="outlined">
                                <h2 id="transition-modal-marca">Marca: </h2>
                                    <TextField id="textfield-marca" label={this.state.marca} onChange={this.handleMarca}  />
                                <h2 id="transition-modal-modelo">Modelo: </h2>
                                    <TextField id="textfield-modelo" label={this.state.modelo} onChange={this.handleModelo}/>
                                <h2 id="transition-modal-color">Color: </h2>
                                    <FormControl variant="filled" >
                                        <InputLabel htmlFor="co">Color</InputLabel>
                                        <Select
                                        value={this.state.color}
                                        onChange={this.handleColor}
                                        >
                                        {this.state.colores.map((option) => <MenuItem key={option.color} value={option.color}>{option.color}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                <h2 id="transition-modal-placa">Placa: </h2>
                                    <TextField disabled id="textfield-placa" label={this.state.placa} onChange={this.handlePlaca}/>

                                <br></br>

                            </FormControl>
                        </div>
                    </Fade>
                </Modal>
            </div>
        );
    }
}

const styles = theme =>({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      display: 'flex',
      backgroundColor: "#8A33FF",
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    h3:{
        marginBottom: "-30px",
        marginTop: "-5px"
    }
  });

export default withStyles(styles, { withTheme: true })(ActualizarCarro);
