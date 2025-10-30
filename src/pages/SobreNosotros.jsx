import { Container, Row, Col, Image, Carousel } from 'react-bootstrap';

export default function SobreNosotros() {
  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <h1 
            className="text-center mb-4" 
            style={{ fontFamily: 'Pacifico, cursive', color: '#8B4513' }}
          >
            Nuestra Dulce Historia
          </h1>

          <Carousel className="mb-4 shadow-sm" interval={3000} fade>
            <Carousel.Item>
              <Image 
                src="https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                rounded 
                // --- ¡CAMBIO! Quitamos la propiedad 'fluid' ---
                className="d-block w-100 carousel-img-fixed-height" 
                alt="Interior de la pasteleria"
              />
              <Carousel.Caption className="bg-dark bg-opacity-50 rounded p-2">
                <h3 style={{ fontFamily: 'Pacifico, cursive' }}>Nuestra Tradicion</h3>
                <p style= {{color: '#FFC0CB'}}>Un ambiente calido y acogedor.</p>
              </Carousel.Caption>
            </Carousel.Item>
            
            <Carousel.Item>
              <Image 
                src="https://images.pexels.com/photos/205961/pexels-photo-205961.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                rounded 
                // --- ¡CAMBIO! Quitamos la propiedad 'fluid' ---
                className="d-block w-100 carousel-img-fixed-height" 
                alt="Variedad de postres"
              />
              <Carousel.Caption className="bg-dark bg-opacity-50 rounded p-2">
                <h3 style={{ fontFamily: 'Pacifico, cursive' }}>Calidad y Variedad</h3>
                <p style={{color: '#FFC0CB'}}>Los mejores ingredientes para los mejores postres.</p>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
              <Image 
                src="https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                rounded 
                // --- ¡CAMBIO! Quitamos la propiedad 'fluid' ---
                className="d-block w-100 carousel-img-fixed-height" 
                alt="Torta de frutas"
              />
              <Carousel.Caption className="bg-dark bg-opacity-50 rounded p-2">
                <h3 style={{fontFamily: 'Pacifico, cursive' }}>Momentos Especiales</h3>
                <p style= {{color: '#FFC0CB'}}>Creamos la torta perfecta para tu celebracion.</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>

          <div className="bg-light p-4 p-md-5 rounded shadow-sm">
            <h2 style={{ fontFamily: 'Pacifico, cursive' }}>50 Anos de Tradicion</h2>
            <p className="lead" style={{ color: '#5D4037' }}>
              Pasteleria 1000 Sabores celebra su 50 aniversario como un referente en la reposteria chilena. 
              Nuestra pasion por la calidad y el sabor nos ha acompanado desde el primer dia.
            </p>

            <blockquote className="blockquote text-center my-4 fst-italic">
              <p className="mb-0">
                "Famosos por nuestra participacion en un record Guinness en 1995, cuando colaboramos en la creacion de la 
                torta mas grande del mundo."
              </p>
            </blockquote>

            <Row className="mt-4">
              <Col md={6} className="mb-3">
                <h3 style={{ fontFamily: 'Pacifico, cursive', color: '#8B4513' }}>Mision</h3>
                <p style={{ color: '#5D4037' }}>
                  Ofrecer una experiencia dulce y memorable a nuestros clientes, proporcionando tortas y productos 
                  de reposteria de alta calidad para todas las ocasiones, mientras celebramos nuestras raices 
                  historicas y fomentamos la creatividad.
                </p>
              </Col>
              <Col md={6}>
                <h3 style={{ fontFamily: 'Pacifico, cursive', color: '#8B4513' }}>Vision</h3>
                <p style={{ color: '#5D4037' }}>
                  Convertirnos en la tienda online lider de productos de reposteria en Chile, conocida por nuestra 
                  innovacion, calidad y el impacto positivo en la comunidad, especialmente en la formacion de nuevos 
                  talentos en gastronomia.
                </p>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

