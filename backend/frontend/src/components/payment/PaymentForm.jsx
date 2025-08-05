import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import '../../assets/styles/custom.css';

const PaymentForm = ({ amount, appointment, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    try {
      // Mock RazorPay integration
      await mockRazorPayPayment();
      
      const paymentData = {
        RazorPayOrderID: `order_${Date.now()}`,
        RazorPaymentID: `pay_${Date.now()}`,
        RazorPaysignature: `signature_${Date.now()}`,
        Status: 'Completed'
      };

      onSuccess(paymentData);
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const mockRazorPayPayment = () => {
    return new Promise((resolve) => {
      // Simulate payment processing
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  };

  return (
    <Form onSubmit={handlePayment}>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card className="mb-4">
        <Card.Body>
          <h6 className="mb-3">Payment Summary</h6>
          <div className="d-flex justify-content-between mb-2">
            <span>Consultation Fee</span>
            <span>${amount.toFixed(2)}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>Platform Fee</span>
            <span>$0.00</span>
          </div>
          <hr />
          <div className="d-flex justify-content-between fw-bold">
            <span>Total Amount</span>
            <span>${amount.toFixed(2)}</span>
          </div>
        </Card.Body>
      </Card>

      <Form.Group className="mb-4">
        <Form.Label>Payment Method</Form.Label>
        <div>
          <Form.Check
            type="radio"
            id="razorpay"
            name="paymentMethod"
            value="razorpay"
            checked={paymentMethod === 'razorpay'}
            onChange={(e) => setPaymentMethod(e.target.value)}
            label="RazorPay (Cards, UPI, Net Banking)"
          />
        </div>
      </Form.Group>

      <Alert variant="info" className="small">
        <strong>Secure Payment:</strong> Your payment information is encrypted and secure. 
        You will be redirected to RazorPay's secure payment gateway.
      </Alert>

      <Button
        type="submit"
        variant="success"
        size="lg"
        className="w-100"
        disabled={processing}
      >
        {processing ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" />
            Processing Payment...
          </>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </Button>

      <div className="text-center mt-3">
        <small className="text-muted">
          By proceeding, you agree to our Terms & Conditions
        </small>
      </div>
    </Form>
  );
};

export default PaymentForm;