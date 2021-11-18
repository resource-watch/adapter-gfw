export const ensureCorrectError: (
  response: Record<'status' | 'body', any>,
  errorMessage: string,
  expectedStatus: number
) => void = ({ status, body }, errMessage, expectedStatus) => {
  status.should.equal(expectedStatus);
  body.should.have.property('errors').and.be.an('array');
  body.errors[0].should.have.property('detail').and.equal(errMessage);
  body.errors[0].should.have.property('status').and.equal(status);
};
