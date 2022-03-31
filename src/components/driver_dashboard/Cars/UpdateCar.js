import React, { Component } from 'react';

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Swal from 'sweetalert2';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import axios from 'axios';

import CircularProgress from '@material-ui/core/CircularProgress';

class UpdateCar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: false,
            open: true,
            car: this.props.car,
            brand: this.props.car.nombre,
            model: this.props.car.descripcion,
            color: this.props.car.categoria,
            plate: this.props.car.precio,
            codigo: this.props.car.codigoId,
            editCar: true,
            colors: [
                { color: 'PERROS', id: "1" },
                { color: 'GATOS', id: "2" },
                { color: 'AVES', id: "3" },
                { color: 'ROEDORES', id: "4" },
                { color: 'OTROS', id: "5" }]
        }
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleBrand = this.handleBrand.bind(this);
        this.handlemodel = this.handlemodel.bind(this);
        this.handleColor = this.handleColor.bind(this);
        this.handlePlate = this.handlePlate.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleCodigo = this.handleCodigo.bind(this);
        

    }

    handleOpen() {
        this.setState({ open: true });
    };

    handleClose() {
        this.setState({ open: false });
    };

    handleBrand(e) {
        this.setState({ brand: e.target.value });
    }

    handlemodel(e) {
        this.setState({ model: e.target.value });
    }
    handleColor(e) {
        this.setState({ color: e.target.value });
    }
    handlePlate(e) {
        this.setState({ plate: e.target.value });
    }

    handleCodigo(e) {
        this.setState({ codigo: e.target.value });
    }

    async handleEdit() {

        console.log("entre aaa 1");
        this.setState({ editCar: false });
        if (this.state.brand !== "" && this.state.model !== "" && this.state.color !== "" && this.state.plate !== "") {
            // sacar user token y username de localEstorage
            var userInfo = JSON.parse(localStorage.getItem('user'));
            // hacer el put
            await axios.put(`https://petshore-backend.herokuapp.com/petshore/product/update/` + userInfo.username,
                {

                    codigoId: this.state.codigo,
                    nombre: this.state.brand,
                    descripcion: this.state.model,
                    precio: this.state.plate,
                    disponible: true,
                    categoria: this.state.color,

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
                            title: 'Carro Editado con Exito!',
                            showConfirmButton: false,
                            timer: 2000
                        });
                        this.props.updateListCar(); // actualizar lista de carros con la funcion componentDidmount de ModalListaCarros
                        this.setState({ open: false });
                        this.setState({ editCar: true });
                    } else {
                        this.setState({ open: false });
                        Swal.fire(
                            'Registro Fallido',
                            'error del servidor, vuelva a intentarlo',
                            'error'
                        )
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
        }
        else {
            Swal.fire(
                'Datos Erroneos',
                'Verifique los campos',
                'error'
            )
            this.setState({ open: false });
        }

        this.setState({ editCar: true });
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
                                <h2 id="transition-modal-plate">Codigo: </h2>
                                <TextField disabled id="textfield-plate" label={this.state.codigo} onChange={this.handleCodigo} />                               
                                <h2 id="transition-modal-brand">Nombre: </h2>
                                <TextField id="textfield-brand" label={this.state.brand} onChange={this.handleBrand} />
                                <h2 id="transition-modal-model">Descripción: </h2>
                                <TextField id="textfield-model" label={this.state.model} onChange={this.handlemodel} />
                                <h2 id="transition-modal-plate">Precio: </h2>
                                <TextField id="textfield-plate" label={this.state.plate} onChange={this.handlePlate} />                                
                                <h2 id="transition-modal-color">Categoria: </h2>
                                <FormControl variant="filled" >
                                    <InputLabel htmlFor="co">Categoria</InputLabel>
                                    <Select
                                        value={this.state.color}
                                        onChange={this.handleColor}
                                    >
                                        {this.state.colors.map((option) => <MenuItem key={option.color} value={option.color}>{option.color}</MenuItem>)}
                                    </Select>
                                </FormControl>


                                <br></br>
                                {
                                    this.state.editCar ?
                                        <Button color="primary" variant="contained" className="submit" onClick={this.handleEdit}>
                                            Editar
                                        </Button>
                                        :
                                        <CircularProgress />
                                }
                            </FormControl>
                            
                        </div>
                    </Fade>
                </Modal>
            </div>
        );
    }
}

const styles = theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        display: 'flex',
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    h3: {
        marginBottom: "-30px",
        marginTop: "-5px"
    }
});

export default withStyles(styles, { withTheme: true })(UpdateCar);