import React, { Component } from 'react';
import clsx from 'clsx';
import CarListModal from './Cars/CarListModal'

import { withStyles } from "@material-ui/core/styles";
import Swal from 'sweetalert2';
import RegisterCarModal from './RegisterCarModal';
import PassangerRequestModal from './PassangerRequestModal';

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
} from '@material-ui/core/';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuIcon from '@material-ui/icons/Menu';
import Pets from '@material-ui/icons/Pets';
import Input from '@material-ui/icons/Input';
import ListIcon from '@material-ui/icons/List';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import EmojiTransportationIcon from '@material-ui/icons/EmojiTransportation';
import GroupIcon from '@material-ui/icons/Group';
import Link from '@material-ui/core/Link';
import OfferTrip from './OfferTrip';
import DriverTripModal from './trip/DriverTripModal';
import ProfileInfo from "../General/ProfileInfo";

import logo from '../../logo.png';

import axios from 'axios';

class DriverDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {

            anchorEl: null,
            mobileMoreAnchorEl: null,
            isMenuOpen: false,
            isMobileMenuOpen: false,
            isCarsOpen: false,
            isTravelsOpen: false,

            selectedIndex: false,
            page1: false,
            page2: false,
            page3: false,
            page4: false,
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
        this.handleClickCars = this.handleClickCars.bind(this);
        this.handleClickTravels = this.handleClickTravels.bind(this);
    }

    async componentDidMount() {

        // verificar usuario de localestorage
        // si no esta es que no se a loegueado redireccionarlo a login
        if (!JSON.parse(localStorage.getItem('user'))) {
            await Swal.fire(
                'No está autentificado',
                'Por favor inicie sesion para usar esta funcionalidad',
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
        await axios.get(`https://petshore-backend.herokuapp.com/auth/loggedUser/` + userLocalestorage.username,
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
                    title: 'Bienvenido ' + user.nombreCompleto,
                    showConfirmButton: false,
                    timer: 1400
                });
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
                title: 'Está seguro de cambiar de perfil?',
                text: "Podra acceder al catalogo que tenemos disponible para todos nuestros usuarios!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '¡Sí, Seguro!',
                cancelButtonText: '¡No, Regresar!',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    history.push('/clientDashboard');
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

    handleListItemClick(index) {
        this.setState({ selectedIndex: index })
        if (index === 0) {
            this.setState({
                page1: !this.state.page1,
                page2: false,
                page3: false,
                page4: false,
            });
        }
        else if (index === 1) {
            this.setState({
                page2: !this.state.page2,
                page1: false,
                page3: false,
                page4: false,
            });
        }
        else if (index === 2) {
            this.setState({
                page3: !this.state.page3,
                page1: false,
                page2: false,
                page4: false,
            });
        }
        else if (index === 3) {
            this.setState({
                page4: !this.state.page4,
                page1: false,
                page2: false,
                page3: false,
            });
        }
        this.handleDrawerClose();

    };
    handleClickCars() {
        this.setState({ isCarsOpen: !this.state.isCarsOpen })
    }

    handleClickTravels() {
        this.setState({ isTravelsOpen: !this.state.isTravelsOpen })
    }

    handleDrawerOpen() {
        this.setState({ open: true });
    };

    handleDrawerClose() {
        this.setState({ open: false });
    };

    render() {
        const { classes } = this.props;

        return (
            <Box m="auto">
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
                                {this.state.viewProfile ? <ProfileInfo /> : null}
                                <MenuItem onClick={this.handleMenuClose.bind(this, 2)}>Compra tus productos!</MenuItem>
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
                        <Divider />
                        <ListItem button onClick={this.handleClickCars}>
                            <ListItemIcon>
                                <Pets />
                            </ListItemIcon>
                            <ListItemText primary="Mis Productos" />
                            {this.state.isCarsOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={this.state.isCarsOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {['Registra tu Producto', 'Ver mis Productos'].map((text, index) => (
                                    <ListItem
                                        className={classes.nested}
                                        button key={text}
                                        selected={this.state.selectedIndex === index}
                                        onClick={this.handleListItemClick.bind(this, index)}
                                    >
                                        <ListItemIcon>{index % 2 === 0 ? <Input /> : <ListIcon />}</ListItemIcon>
                                        <ListItemText primary={text} />
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>
                        <Divider />
                        <ListItem button onClick={this.handleClickTravels}>
                            <ListItemIcon>
                                <GroupIcon />
                            </ListItemIcon>
                            <ListItemText primary="Mis Promociones" />
                            {this.state.isTravelsOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={this.state.isTravelsOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {['Ofrecer Productos', 'Solicitudes de Productos'].map((text, index) => (
                                    <ListItem
                                        className={classes.nested}
                                        button key={text}
                                        selected={this.state.selectedIndex === index + 2}
                                        onClick={this.handleListItemClick.bind(this, index + 2)}
                                    >
                                        <ListItemIcon>{index % 2 === 0 ? <EmojiTransportationIcon /> : <ListIcon />}</ListItemIcon>
                                        <ListItemText primary={text} />
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>
                    </List>
                </Drawer>
                <Box m="auto">
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <Box>

                        <div>

                            {!this.state.page1 && !this.state.page2 && !this.state.page3 && !this.state.page4 &&
                                <div>
                                    <article>
                                        <Typography variant="h3">
                                            Producto camino a su destino:
                                        </Typography>
                                    </article>
                                    <div>
                                        <DriverTripModal />
                                    </div>
                                </div>}
                            <div>
                                {this.state.page1 ? <RegisterCarModal /> : null}
                            </div>
                            <div>
                                {this.state.page2 ? <CarListModal /> : null}
                            </div>
                            <div>
                                {this.state.page3 ? <OfferTrip /> : null}
                            </div>
                            <div>
                                {this.state.page4 ? <PassangerRequestModal /> : null}
                            </div>

                        </div>
                    </Box>
                </main>
                </Box>
            </div>
            </Box>


        )
    }
}
const drawerWidth = 240;


const styles = theme => ({
    root: {
        display: 'flex',
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
        marginRight: 36,
    },
    menuLogo: {
        position: "relative",
    },
    menuTitle: {
        marginLeft: "5px",
        color: "#FFFFFF",
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
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


export default withStyles(styles, { withTheme: true })(DriverDashboard);
