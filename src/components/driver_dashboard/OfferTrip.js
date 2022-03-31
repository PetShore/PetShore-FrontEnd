import React from 'react';
import {
    withStyles,
    TextField,
    MenuItem,
    Button,
    CircularProgress,
    Box,
    Typography
} from '@material-ui/core';

import Swal from 'sweetalert2';
import axios from 'axios';

import SockJsClient from 'react-stomp';

const styles = theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    link: {
        display: 'flex',
    },
    icon: {
        marginRight: theme.spacing(0.5),
        width: 25,
        height: 25,
    },
});

class OfferTrip extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            onPressSend:false,
            clientConnected: false, messages: "", from: 'Fundación Animalitos Cariñositos', fromAll: '', districtFrom: '', to: 'Calle 25', toAll: '', districtTo: '', price: 0, universities: [], cars: [], currentCar: "", userInfo: "", route: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        // sacar info usuario localestorage
        var userLocalestorage = await JSON.parse(localStorage.getItem('user'));
        this.setState({ userInfo: userLocalestorage });

        // sacar listas de cars
        var user = this.state.userInfo;
        if (user !== "") {
            const username = user.username;
            await axios.get(`https://petshore-backend.herokuapp.com/petshore/product/` + username,
                {
                    headers: {
                        Authorization: userLocalestorage.token //the token is a variable which holds the token
                    }
                }
            )
                .then(res => {
                    const cars = res.data;
                    this.setState({ cars: cars });
                    if (cars.length === 0) {
                        Swal.fire({
                            title: 'Debes registrar un producto para iniciar una oferta',
                            showDenyButton: false,
                            showCancelButton: false,
                            confirmButtonText: `ok`,
                          }).then((result) => {
                            /* Read more about isConfirmed, isDenied below */
                            if (result.isConfirmed) {
                                window.location.reload()
                            } else if (result.isDismissed) {
                                window.location.reload()
                            }
                          })
                    }

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
        }
    }

    handleAll = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.state.price < 0 || this.state.from === this.state.to) {
            alert("Los datos ingresados son incorrectos");
        }
        else if (this.state.currentCar === "") {
            alert("Debe seleccionar un Animalito");
        }
        else {
            alert("Adopción comenzada");
        }
    };

    handleOfferTrip(response) {
        this.setState({ messages: response });
    }

    componentDidUpdate() {
        // Uso tipico (no olvides de comparar las props):
        if (this.state.messages !== "") {
            if(this.state.onPressSend){
                this.setState({onPressSend:false})
                if (this.state.messages === "The driver selected is not available") {
                    this.setState({ messages: "" })
                    Swal.fire(
                        'Error',
                        'Usted ya tiene una pedido en proceso',
                        'warning'
                    )
                } else {
                    this.setState({ messages: "" })
                    Swal.fire(
                        'Adopción Registrado!',
                        'Ahora podra esperar a sus animalito',
                        'success'
                    )
                }
            }
        }
    }

    send = () => {
        var userLocalestorage = JSON.parse(localStorage.getItem('user'));
        if (this.state.to !== "" && this.state.from !== "" && this.state.price !== ""
            && this.state.userInfo !== "" && this.state.currentCar !== "") {
            try {
                this.setState({onPressSend:true})
                this.clientRef.sendMessage(`/wss/offerTravel.${userLocalestorage.username}`, JSON.stringify({ ruta: this.state.route, precio: this.state.price, origen: [this.state.fromAll.lat, this.state.fromAll.lng, this.state.from, this.state.districtFrom], destino: [this.state.toAll.lat, this.state.toAll.lng, this.state.to, this.state.districtTo], carro: this.state.currentCar }));
            } catch (error) {
                Swal.fire(
                    'Error al registrar',
                    'Error socket, no hay conexion',
                    'error'
                )
            }
        }
        else {
            Swal.fire(
                'Datos Incorrectos',
                'Error al ingresar los datos, vuelva a intentarlo',
                'error'
            )
        }

    }

    render() {
        return (

            <React.Fragment>
                <SockJsClient
                    url='https://petshore-backend.herokuapp.com/wss'
                    topics={['/petshore/drivers']}
                    onConnect={console.log("Connection established!")}
                    onDisconnect={console.log("Disconnected!")}
                    onMessage={(response) => this.handleOfferTrip(response)}
                    ref={(client) => { this.clientRef = client }}
                    debug={true}
                />

                <Box m="auto">
                    <Typography color='initial' variant="h2">
                        <strong>Escoja el destino donde se enviara el producto:</strong>
                    </Typography>
                    <Typography variant="h5">
                        <strong>Destino:</strong> {this.state.to}
                    </Typography>
                </Box>
                <Box m="auto">
                    <form onSubmit={this.handleSubmit}>
                        <br></br>
                        <h2>Posible Destino</h2>
                        <br></br>
                        <div>
                            <br></br>
                            <div>
                                <TextField disabled={true} name="from" value={this.state.from} variant="outlined" id="From" label="Inicio" type="text"
                                    onChange={this.handleAll} fullWidth autoFocus required />
                            </div>



                            <br></br>

                            {
                                this.state.cars.length > 0 ?

                                    <div>
                                        <TextField variant="outlined" name="currentCar" value={this.state.currentCar} id="car" label="¿Que producto se requiere?" select required fullWidth
                                            onChange={this.handleAll}>
                                            {this.state.cars.map((car, index) => (<MenuItem key={index} value={car.placa }>{car.placa }</MenuItem>))}
                                        </TextField>
                                    </div>
                                    :
                                    <CircularProgress />
                            }
                            <br></br>
                            <div>
                                <div>
                                    <TextField disabled={true} name="to" value={this.state.to} variant="outlined" id="to" label="Destino" type="text"
                                        onChange={this.handleAll} fullWidth autoFocus required />
                                </div>
                            </div>
                            <br></br>
                            <br></br>
                            <div>
                                <TextField name="price" value={this.state.price} id="outlined-number" label="Precio Total" type="number" InputLabelProps={{ shrink: true, }}
                                    variant="outlined" onChange={this.handleAll} fullWidth autoFocus
                                    required />
                            </div>
                            <br></br>
                        </div>
                        <div>
                            <Button onClick={this.send} color="primary" variant="contained">
                                Confirmar envio
                            </Button>
                        </div>
                        <br></br>
                        <br></br>
                    </form>
                </Box>

            </React.Fragment>

        );
    }
}

export default withStyles(styles)(OfferTrip);
