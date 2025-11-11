import { Container, Row, Col, Image, Carousel } from 'react-bootstrap';

export default function SobreNosotros() {
  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <h1 
            className="text-center mb-4" 
            style={{ fontFamily: 'Pacifico, cursive', color: '#f9889bff' }}
          >
            Nuestra Dulce Historia
          </h1>

          <Carousel className="mb-4 shadow-sm" interval={3000} fade>
            <Carousel.Item>
              <Image 
                src="https://images.pexels.com/photos/808941/pexels-photo-808941.jpeg" 
                rounded 
                
                className="d-block w-100 carousel-img-fixed-height" 
                alt="Interior de la pasteleria"
              />
              <Carousel.Caption className="bg-dark bg-opacity-50 rounded p-2">
                <h3 style={{ color: '#ffffffff', fontFamily: 'Pacifico, cursive' }}>Nuestra Tradicion</h3>
                <p style= {{color: '#FFC0CB'}}>Un ambiente calido y acogedor.</p>
              </Carousel.Caption>
            </Carousel.Item>
            
            <Carousel.Item>
              <Image 
                src="https://images.pexels.com/photos/853004/pexels-photo-853004.jpeg" 
                rounded 
                
                className="d-block w-100 carousel-img-fixed-height" 
                alt="Variedad de postres"
              />
              <Carousel.Caption className="bg-dark bg-opacity-50 rounded p-2">
                <h3 style={{ color: '#ffffffff',fontFamily: 'Pacifico, cursive' }}>Calidad y Variedad</h3>
                <p style={{color: '#FFC0CB'}}>Los mejores ingredientes para los mejores postres.</p>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
              <Image 
                src="https://images.pexels.com/photos/224198/pexels-photo-224198.jpeg" 
                rounded 
                
                className="d-block w-100 carousel-img-fixed-height" 
                alt="Torta de frutas"
              />
              <Carousel.Caption className="bg-dark bg-opacity-50 rounded p-2">
                <h3 style={{color: '#ffffffff',fontFamily: 'Pacifico, cursive' }}>Momentos Especiales</h3>
                <p style= {{color: '#FFC0CB'}}>Creamos la torta perfecta para tu celebración.</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>

          <div className="bg-light p-4 p-md-5 rounded shadow-sm">
            <h2 style={{ fontFamily: 'Pacifico, cursive' }}>50 Años de Tradición</h2>
            <p className="lead" style={{ color: '#5D4037' }}>
              Pastelería Mil Sabores celebra su 50 aniversario como un referente en la repostería chilena. 
              Nuestra pasión por la calidad y el sabor nos ha acompanado desde el primer día.
            </p>

            <blockquote className="blockquote text-center my-4 fst-italic">
              <p className="mb-0">
                "Famosos por nuestra participación en un record Guinness en 1995, cuando colaboramos en la creación de la 
                torta mas grande del mundo."
              </p>
            </blockquote>

            <Row className="mt-4">
              <Col md={6} className="mb-3">
                <h3 style={{ fontFamily: 'Pacifico, cursive', color: '#8B4513' }}>Mision</h3>
                <p style={{ color: '#5D4037' }}>
                  Ofrecer una experiencia dulce y memorable a nuestros clientes, proporcionando tortas y productos 
                  de repostería de alta calidad para todas las ocasiones, mientras celebramos nuestras raices 
                  históricas y fomentamos la creatividad.
                </p>
              </Col>
              <Col md={6}>
                <h3 style={{ fontFamily: 'Pacifico, cursive', color: '#8B4513' }}>Vision</h3>
                <p style={{ color: '#5D4037' }}>
                  Convertirnos en la tienda online lider de productos de repostería en Chile, conocida por nuestra 
                  innovación, calidad y el impacto positivo en la comunidad, especialmente en la formación de nuevos 
                  talentos en gastronomía.
                </p>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

