import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import './PassangerRequestModal.css';
import SockJsClient from 'react-stomp';
import Swal from 'sweetalert2';

class PassangerRequestModal extends Component{

    render(){
      return(<SimpleTable/>)
    }
}


class RowPas extends Component {
    constructor(props){
        super(props);
        this.state = {
           stateBoton: 'Accept',row:props.crow,messages: ""
        }
        this.key=props.keys;
    }

    changeEstado(e){
      var row = {...this.state.row};
      if(this.state.stateBoton==='Accept'){
        row.estado='Esperando a tramites finales';
        this.setState({row});
        this.setState({stateBoton:'En camino'});
        this.sendTrue();
      }else if(this.state.stateBoton==='picked up'){
        row.estado='En transporte';
        this.setState({row});
        this.setState({stateBoton:'Paso algo?'});
      }
    }
    cancel(e){
      var row = {...this.state.row};
      row.estado='searching driver';
      this.setState({row});
      this.setState({stateBoton:'Accept'});
      this.sendFalse();
    }

    sendTrue = () => {
        var userLocalestorage = JSON.parse(localStorage.getItem('user'));
        try {
            this.clientRef.sendMessage(`/wss/acceptOrRejectPassenger.${this.state.row.name}`, JSON.stringify({ usuario:userLocalestorage.username,estado: true}));
        } catch (error) {
            Swal.fire(
                'Error al aceptar o rechazar el proceso de adopción',
                'Error socket, no hay conexion',
                'error'
            )
            }
    }

    handleOfferTrip(response) {
        this.setState({ messages: response });
    }

    sendFalse = () => {
        var userLocalestorage = JSON.parse(localStorage.getItem('user'));
        try {     
            console.log(this.state.row.name);
            console.log(userLocalestorage);
            console.log(this.state.statePassanger);
            this.clientRef.sendMessage(`/wss/acceptOrRejectPassenger.${this.state.row.name}`, JSON.stringify({ usuario:userLocalestorage.username,estado: false}));
        } catch (error) {
            Swal.fire(
                'Error al aceptar o rechazar el proceso de adopción',
                'Error socket, no hay conexion',
                'error'
            )
        }
    }

    render(){
        let btn_class='';
        if(this.state.stateBoton==='Accept'){
          btn_class= 'buttonyellow';
        }else if(this.state.stateBoton==='picked up'){
          btn_class='buttongreen';
        }else{
          btn_class='buttonblack';
        }
        let row=this.state.row;
        return (
          <TableRow key={row.name}>
            <SockJsClient
                url='https://petshore-backend.herokuapp.com/wss'
                topics={['/petshore/acceptOrRejectPassenger']}
                onConnect={console.log("Connection established!")}
                onDisconnect={console.log("Disconnected!")}
                onMessage={(response) => this.handleOfferTrip(response)}
                ref={(client) => { this.clientRef = client }}
                debug={true}
            />
            <TableCell component="th" scope="row">
              {row.name}
            </TableCell>
            <TableCell align="right" className={[btn_class,'noborder'].join(' ')}>{row.estado}</TableCell>
            <TableCell align="right">{row.lugar}</TableCell>
            <TableCell align="right">
                  <Button className={btn_class}
                   onClick={this.changeEstado.bind(this)} variant="outlined" color="primary">
                    {this.state.stateBoton}
                  </Button>
                   {this.state.stateBoton==='picked up' ?       <Button className="cancelbutton marginbuttonleft"
                         onClick={this.cancel.bind(this)} variant="outlined" color="primary">
                            Cancelar
                        </Button>  : null}
                    {this.state.stateBoton==='passanger' ?        <Button className="buttongreen marginbuttonleft"
                        onClick={this.cancel.bind(this)} variant="outlined" color="primary">
                           Llegó
                       </Button> : null}
            </TableCell>
          </TableRow>
          
        )
    }
}

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(name, estado, lugar) {
  return { name, estado, lugar };
}

const rows = [
  createData('Juan','Revisando papeleo','Toberin Cll 151 #20-17'),
  createData('Victor','En camino','Cedritos Cll 134 #15-48'),
  createData('Mario','Iniciando Proceso','Mazuren Cll 134 #40-5'),
];

const SimpleTable=((props)=> {
  const classes = useStyles();


  return (
    <TableContainer component={Paper}>
          <Typography variant="h3" id="tableTitle" component="div">
            Solicitudes de Pedidos
          </Typography>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Posible Destino</TableCell>
            <TableCell align="right">Estado</TableCell>
            <TableCell align="right">Dirección</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
              {rows.map((row,index) => (
                  <RowPas crow={row} key={index}/>
              ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
})
export default PassangerRequestModal;
