import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import CardHeader from "@material-ui/core/CardHeader";
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import UsersInfo from "../../General/UsersInfo";

import Swal from 'sweetalert2';
import axios from 'axios';

class PassengerTripModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            width: window.innerWidth,
            currentTrip: [],
            shape: []
        }
    }

    // resize box
    updateDimensions = () => {
        this.setState({ width: window.innerWidth });
    };

    async componentDidMount() {
        // resize box
        window.addEventListener('resize', this.updateDimensions);
        window.onresize = this.updateDimensions;

        // sacar info usuario localestorage
        var userLocalestorage = await JSON.parse(localStorage.getItem('user'));
        this.setState({ userInfo: userLocalestorage })
        await axios.get(`https://petshore-backend.herokuapp.com/petshore/shop/client/` + userLocalestorage.username,
            {
                headers: {
                    Authorization: userLocalestorage.token //the token is a variable which holds the token
                }
            }
        )
            .then(res => {
                const currentTrip = res.data;
                console.log("currentTrip: ",currentTrip)
                this.setState({ currentTrip });
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
    // resize box
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    render() {
        const { classes } = this.props;
        const trip = {
            tripInProgress: { from: "ECI", to: "Prado", stateTrip: "En curso" },
            driver: { name: "Jade", rating: 4 },
            dueDate: new Date().getDay() + "/" + new Date().getMonth() + "/" + new Date().getFullYear(),
            passengers:
                [
                    { name: "Pepito Perez", email: "ppitop@gmail", rating: 4 },
                    { name: "Pasajero prueba", email: "prueba@gmail", rating: 3 },
                ]
        };
        return (
            <Grid container className={classes.gridContainer} spacing={2}>
                <Grid item xs={12}>
                    <Grid container justify="center" spacing={2}>
                        <Grid item>
                            <Card style={{
                                        width: this.state.width - 400,
                                        height: "100%",
                                        marginBottom: "50px",
                                        backgroundColor: "#E0E3E5"
                                    }}>
                                <CardHeader
                                    action={this.renderModalInfoPersona}
                                    title={
                                        <Typography gutterBottom variant="h5" component="h2">
                                            Nombre de la Tienda: <UsersInfo user={trip.driver} />
                                            <br />
                                            Estado: En camino a tu casa
                                        </Typography>
                                    }
                                />

                                
                                
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}


const styles = theme => ({
    root: {
        width: "300px",
        height: "100%",
        marginBottom: "50px",
        backgroundColor: "#E0E3E5"
    },
    demo: {
        backgroundColor: "#8A33FF",
    },
    gridContainer: {
        flexGrow: 1,
    },

});


export default withStyles(styles, { withTheme: true })(PassengerTripModal);