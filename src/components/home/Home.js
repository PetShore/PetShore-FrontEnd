import React, { Component } from 'react';
import logo from '../../logo.png';
import './Home.css';

import road from './road.jpg';
import drive from './drive.jpg';
import route from './route.png';
import money from './money.png';
import connect from './connect.png';
import Grid from '@material-ui/core/Grid';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = { }
    }

    render() {
        document.body.classList.add('home');
        return (
          <div >
            <section id="home" className="home">
              <div id="banner">
                <img id="bannerimg" src={drive} alt="banner petshore"/>
                <header className="home">
                  <div>
                  <h1 className="home"> PetShore </h1>
                  </div>
                  <div>
                    <img src={logo} id="logito" alt="logo" />
                  </div>
                    <div className="header-right">
                     <a href="/login">Ingresar</a>
                     <a href="/RegisterUser">Registro</a>
                     <a href="#about">Acerca de</a>
                   </div>
                </header>
                <div id="slogan" className="centered">
                    <p>La aplicación necesaria para comprar los productos necesarios para que puedas consentir a tu mascota.</p>
                </div>
                  </div>
              </section>
              <section id="about" className="home">
                <div id="info" className="gridcont">
                   <Grid container spacing={3}>
                     <Grid item xs={6}>
                        <h2 className="home"> ¿Quienes somos? </h2>
                       <p>Somos una aplicación que te da la oportunidad de comprar productos de manera digital sin tener que moverte de tu casa.  Puedes interactuar con tiendas de todos los lugares para comprar tus productos, donde también puedes emprender y vender los productos que veas de utilidad para otras personas</p>
                     </Grid>
                     <Grid item xs={6} className="cuadro">
                       <img src={road} alt="cuadro petshore"/>
                     </Grid>
                 </Grid>
                </div>
              </section>
              <section id="ls" className="home">
                  <div id="otros" className="gridcont">
                     <Grid container spacing={3}>
                       <Grid item xs>
                          <h3 className="home"> Compra de forma segura y confiable  </h3>
                          <p> Se te conectara con las tiendas y lugares de animales disponibles en la ciudad de Bogotá. </p>
                          <img src={route} className="valores" alt="container descripcion"/>
                       </Grid>
                       <Grid item xs>
                          <h3 className="home"> Ahorra Dinero </h3>
                          <p> No tendrás que salir de la comodidad de tu casa </p>
                            <img src={money} className="valores" alt="banner descripcion ahorro"/>
                       </Grid>
                       <Grid item xs>
                          <h3 className="home"> Conéctate con más personas</h3>
                          <p> Podrás conocer a muchas personas que vendan productos para que puedas consentir a tu mascota en Bogotá. </p>
                          <img src={connect} className="valores" alt="banner descripcion personas"/>
                       </Grid>
                   </Grid>
                  </div>

              </section>
              <a id="upbutton"  href="/#"> <i className="fa fa-arrow-circle-up"></i></a>

          </div>
        )
    }
}



export default Home;
