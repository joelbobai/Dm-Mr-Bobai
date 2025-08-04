process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../index');
const nodemailer = require('nodemailer-mock');
const { mock } = nodemailer;

describe('POST /bobai/sendmail', () => {
  beforeEach(() => {
    mock.reset();
    mock.setShouldFail(false);
  });

  it('sends an email successfully', async () => {
    const res = await request(app)
      .post('/bobai/sendmail')
      .send({
        name: 'john',
        email: 'john@example.com',
        subject: 'hello',
        message: 'test message',
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Message Sent');
    const sent = mock.getSentMail();
    expect(sent.length).toBe(1);
    expect(sent[0].to).toContain('joelisaiahbobai@gmail.com>');
  });

  it('handles sendMail failure', async () => {
    mock.setShouldFail(true);

    const res = await request(app)
      .post('/bobai/sendmail')
      .send({
        name: 'john',
        email: 'john@example.com',
        subject: 'hello',
        message: 'test message',
      });

    expect(res.status).toBe(500);
    expect(res.body.status).toBe('FAILED');
  });
});
