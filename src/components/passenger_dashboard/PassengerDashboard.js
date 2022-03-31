import React, { Component } from 'react';
import clsx from 'clsx';

import { withStyles } from "@material-ui/core/styles";

import Swal from 'sweetalert2';

import {
    Menu,
    MenuItem,
    Drawer,
    AppBar,
    Toolbar,
    List,
    CssBaseline,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemIcon,
    ListItemText,
    Box,
    Collapse,
    Link,
} from '@material-ui/core/';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuIcon from '@material-ui/icons/Menu';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import TelegramIcon from '@material-ui/icons/Telegram';

import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Pets from '@material-ui/icons/Pets';
import logo from '../../logo.png';
import Requests from './Requests';
import TripOfferedDriver from "./TripOfferedDriver";
import PassengerTripModal from './trip/PassengerTripModal';

import ProfileInfo from "../General/ProfileInfo";

import axios from 'axios';

class DashBoardPasajero extends Component {

    constructor(props) {
        super(props);
        this.state = {

            anchorEl: null,
            mobileMoreAnchorEl: null,
            isMenuOpen: false,
            isMobileMenuOpen: false,
            isRequestsOpen: false,
            isViajesOpen: false,

            selectedIndex: false,
            view1: false,
            view2: false,
            view3: false,
            view4: false,
            open: false,
            viewProfile: false,
            userInfo:""
        }

        this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
        this.handleDrawerClose = this.handleDrawerClose.bind(this);
        this.handleListItemClick = this.handleListItemClick.bind(this);

        this.handleProfileMenuOpen = this.handleProfileMenuOpen.bind(this);
        this.handleMobileMenuClose = this.handleMobileMenuClose.bind(this);
        this.handleMenuClose = this.handleMenuClose.bind(this);
        this.handleMobileMenuOpen = this.handleMobileMenuOpen.bind(this);
        this.handleClickRequests = this.handleClickRequests.bind(this);
        this.handleClickRequestsViajes = this.handleClickRequestsViajes.bind(this);
    }

    async componentDidMount() {

        // verificar usuario de localestorage
        // si no esta es que no se a loegueado redireccionarlo a login
        if (!JSON.parse(localStorage.getItem('user'))) {
            await Swal.fire(
                'No está autentificado',
                'Por favor inicie sesión para usar esta funcionalidad',
                'error'
            )
            // eliminar localStorage
            await localStorage.clear();
            // redireccionar a login
            window.location.replace("/login")
        }

        // sacar info usuario localestorage
        var userLocalestorage = await JSON.parse(localStorage.getItem('user'));
        this.setState({ userInfo: userLocalestorage })
        // sacar usuario si es valido, si no redirigirlo al login
        await axios.get(`https://petshore-backend.herokuapp.com/auth/loggedUser/`+userLocalestorage.username,
            {
                headers: {
                    Authorization: userLocalestorage.token //the token is a variable which holds the token
                }
            }
        )
            .then(res => {
                const user = res.data;
                Swal.fire({
                    icon: 'success',
                    title: 'Bienvenido '+user.nombreCompleto,
                    showConfirmButton: false,
                    timer: 1400
                  });
            })
            .catch(async function () {
                // aqui entra cuando el token es erroneo, toca pedirle que vuelva a loguearse
                await Swal.fire(
                    'Sesion Finalizada',
                    'Vuelva a Iniciar Sesión',
                    'error'
                )
                //clear local estorage
                localStorage.clear();
                // redireccionar a login
                window.location.replace("/login")
            });
    }

    handleProfileMenuOpen(event) {
        this.setState({ anchorEl: event.currentTarget, isMenuOpen: true });
        this.handleMobileMenuClose();
    };

    handleMobileMenuClose() {
        this.setState({ mobileMoreAnchorEl: null, isMobileMenuOpen: false });
    };

    async handleMenuClose(index) {
        const { history } = this.props;

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: true
        })

        this.setState({ anchorEl: null, isMenuOpen: false });
        this.handleMobileMenuClose();

        if (index === 1) { //modal perfil usuario
            if (this.state.viewProfile) {
                await this.setState({ viewProfile: false });
                this.setState({ viewProfile: true });
            } else {
                this.setState({ viewProfile: true });
            }
        }

        if (index === 2) { // cambio dashboard
            swalWithBootstrapButtons.fire({
                title: '¿Está seguro de cambiar de perfil?',
                text: "Como tienda podrá ofrecer productos o emprendimientos para otro usuarios",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '¡Sí, Seguro!',
                cancelButtonText: '¡No, Regresar!',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    history.push('/shopDashboard');
                }
            })
        }

        if (index === 3) {
            swalWithBootstrapButtons.fire({
                title: '¿Está seguro de cerrar sesión?',
                text: "Será redirigido a la Página Principal",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '¡Sí, Seguro!',
                cancelButtonText: '¡No, Regresar!',
                reverseButtons: true
            }).then(async (result) => {
                if (result.isConfirmed) {
                    // limpiar localStorage
                    await localStorage.clear();
                    history.push('/home');
                }
            })
        }
    };

    handleMobileMenuOpen(event) {
        this.setState({ mobileMoreAnchorEl: event.currentTarget, isMobileMenuOpen: true });
    };

    handleViewCurrentTrip = () => { 
        this.setState({
            view1: false,
            view2: true,
            view3: false,
            view4: false,
        });
    }

    handleListItemClick(index) {
        this.setState({ selectedIndex: index })
        if (index === 0) {
            this.setState({
                view1: !this.state.view1,
                view2: false,
                view3: false,
                view4: false,
            });
        }
        else if (index === 1) {
            this.setState({
                view2: !this.state.view2,
                view1: false,
                view3: false,
                view4: false,
            });
        }
        else if (index === 2) {
            this.setState({
                view3: !this.state.view3,
                view1: false,
                view2: false,
                view4: false,
            });
        }
        else if (index === 3) {
            this.setState({
                view4: !this.state.view4,
                view1: false,
                view2: false,
                view3: false,
            });
        }
        this.handleDrawerClose();

    };

    handleClickRequests = () => {

        this.setState({ isRequestsOpen: !this.state.isRequestsOpen });
    }

    handleClickRequestsViajes() {
        this.setState({ isViajesOpen: !this.state.isViajesOpen })
    }

    handleDrawerOpen() {
        this.setState({ open: true });
    };

    handleDrawerClose() {
        this.setState({ open: false });
    };

    render() {
        const { classes } = this.props;
        document.body.classList.add('driverDashboard');
        return (
            <div className={classes.root}>

                <CssBaseline />
                <AppBar
                    position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: this.state.open,
                    })}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={this.handleDrawerOpen}
                            edge="start"
                            className={clsx(classes.menuButton, this.state.open && classes.hide)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <img src={logo} width="40px" height="40px" margin="auto" alt="Logo" />

                        <Typography variant="h6" noWrap href="/home">
                            <Link href="/home">
                                <div className={classes.menuTitle}>
                                    PetShore
                                </div>
                            </Link>
                        </Typography>
                        <div className={classes.grow} />
                        <div className={classes.sectionDesktop}>
                            <IconButton
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={'primary-search-account-menu'}
                                aria-haspopup="true"
                                onClick={this.handleProfileMenuOpen}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                anchorEl={this.state.anchorEl}
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                id={'primary - search - account - menu'}
                                keepMounted
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                open={this.state.isMenuOpen}
                                onClose={this.handleMenuClose}
                            >
                                <MenuItem onClick={this.handleMenuClose.bind(this, 1)}>Perfil</MenuItem>
                                {this.state.viewProfile ? <ProfileInfo user={{ name: "Juanito", email: "juanito@hotmail.com", rating: 5 }} /> : null}
                                <MenuItem onClick={this.handleMenuClose.bind(this, 2)}>Ser Tienda</MenuItem>
                                <MenuItem onClick={this.handleMenuClose.bind(this, 3)}>Cerrar Sesión</MenuItem>
                            </Menu>
                        </div>
                        <div className={classes.sectionMobile}>
                            <IconButton
                                aria-label="show more"
                                aria-controls={'primary-search-account-menu-mobile'}
                                aria-haspopup="true"
                                onClick={this.handleMobileMenuOpen}
                                color="inherit"
                            >
                                <MoreIcon />
                            </IconButton>
                            <Menu
                                anchorEl={this.state.mobileMoreAnchorEl}
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                id={'primary - search - account - menu - mobile'}
                                keepMounted
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                open={this.state.isMobileMenuOpen}
                                onClose={this.handleMobileMenuClose}
                            >
                                <MenuItem onClick={this.handleProfileMenuOpen}>

                                    <IconButton
                                        aria-label="account of current user"
                                        aria-controls="primary-search-account-menu"
                                        aria-haspopup="true"
                                        color="inherit"
                                    >
                                        <AccountCircle />
                                    </IconButton>
                                    <span>Perfil</span>

                                </MenuItem>
                            </Menu>
                        </div>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="temporary"
                    open={this.state.open}
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: this.state.open,
                        [classes.drawerClose]: !this.state.open,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: this.state.open,
                            [classes.drawerClose]: !this.state.open,
                        }),
                    }}
                >
                    <div className={classes.toolbar}>
                        <IconButton onClick={this.handleDrawerClose}>
                            {classes.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </div>
                    <Divider />
                    <List>
                        <ListItem button onClick={this.handleClickRequests}>
                            <ListItemIcon>
                                <TelegramIcon />
                            </ListItemIcon>
                            <ListItemText primary="Mis Solicitudes" />
                            {this.state.isRequestsOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={this.state.isRequestsOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem
                                    className={classes.nested}
                                    button
                                    selected={this.state.selectedIndex === 0}
                                    onClick={this.handleListItemClick.bind(this, 0)}
                                >
                                    <ListItemIcon>
                                        <CheckCircleOutlineIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Activas" />
                                </ListItem>
                            </List>
                        </Collapse>

                        <ListItem button onClick={this.handleClickRequestsViajes}>
                            <ListItemIcon>
                                <Pets />
                            </ListItemIcon>
                            <ListItemText primary="Reastrea tu promoción!" />
                            {this.state.isViajesOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={this.state.isViajesOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem
                                    className={classes.nested}
                                    button
                                    selected={this.state.selectedIndex === 1}
                                    onClick={this.handleListItemClick.bind(this, 1)}
                                >
                                    <ListItemIcon>
                                        <CheckCircleOutlineIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Actual" />
                                </ListItem>
                            </List>
                        </Collapse>
                    </List>
                </Drawer>
                <main
                    className={clsx(classes.content, {
                        [classes.contentShift]: this.state.open,
                    })}
                >
                    <div className={classes.toolbar} />
                    <Box>
                        <div>
                            {!this.state.view1 && !this.state.view2 && !this.state.view3 && !this.state.view4 &&
                                <div>
                                    <Typography variant="h3">
                                        Promociones disponibles en tu sector:
                                    </Typography>
                                    <TripOfferedDriver redirectCurrentTrip={this.handleViewCurrentTrip}/>
                                </div>}
                            <div>
                                {this.state.view1 &&
                                    <Requests />
                                }

                            </div>
                            <div>
                                {this.state.view2 &&
                                    <div>
                                        <div>
                                            <Typography variant="h3">
                                                Solicitud Actual:
                                            </Typography>
                                        </div>
                                        <div>
                                            <PassengerTripModal />
                                        </div>
                                    </div>}
                            </div>
                            <div>
                                {this.state.view3 &&
                                    <Typography variant="h6">
                                        Vista 3
                                </Typography>
                                }
                            </div>
                            <div>
                                {this.state.view4 &&
                                    <Typography variant="h6" noWrap>
                                        Vista 4
                                </Typography>
                                }
                            </div>
                        </div>
                    </Box>
                </main>
            </div>


        )
    }
}
const drawerWidth = 240;


const styles = theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: "#C0C0C0"
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    grow: {
        flexGrow: 1,
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    menuTitle: {
        marginLeft: "5px",
        color: "#FFFFFF"
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
});


export default withStyles(styles, { withTheme: true })(DashBoardPasajero);
