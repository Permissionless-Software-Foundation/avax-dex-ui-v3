/*
  Component for rendering individual Cards. Each Card represents a token class.
*/

// Global npm libraries
import React from 'react'
import { Container, Row, Col, Button, Card } from 'react-bootstrap'

function AvaxTokenCard (props) {
// class AvaxTokenCard extends React.Component {
  //   render(props) {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body style={{ textAlign: 'center' }}>
        <Card.Title>{props.symbol}</Card.Title>
        <Card.Subtitle className='mb-2 text-muted'>{props.name}</Card.Subtitle>
        <Card.Text>
          Quantity: {props.qty}
        </Card.Text>
        <Container>
          <Row>
            <Col><Button>Sell</Button></Col>
            <Col><Button variant='info'>Send</Button></Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  )
}
// }

export default AvaxTokenCard
