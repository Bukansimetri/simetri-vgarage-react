import React, { useState } from 'react';

function SelfDiagnosis() {
  const [answer1, setAnswer1] = useState(null);
  const [answer2, setAnswer2] = useState(null);
  const [answer3, setAnswer3] = useState(null);
  const [answer4, setAnswer4] = useState(null);
  const [answer5, setAnswer5] = useState(null);
  const [answer6, setAnswer6] = useState(null);
  const [answer7, setAnswer7] = useState(null);
  const [answer8, setAnswer8] = useState(null);
  const [answer9, setAnswer9] = useState(null);
  const [answer10, setAnswer10] = useState(null);

  return (
    <div className="self-diagnosis-container" style={{ maxWidth: 500, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 12 }}>
      <h2>Self Diagnosis</h2>
      {/* Question 1 */}
      <div style={{ marginBottom: 24 }}>
        <strong>1) is your vehicle still able to start and operate?</strong>
      </div>
      <div style={{ marginBottom: 24 }}>
        <button
          style={{ marginRight: 16, padding: '8px 24px' }}
          onClick={() => {
            setAnswer1('no');
            setAnswer2(null); setAnswer3(null); setAnswer4(null); setAnswer5(null);
            setAnswer6(null); setAnswer7(null); setAnswer8(null); setAnswer9(null); setAnswer10(null);
          }}
        >
          No
        </button>
        <button
          style={{ padding: '8px 24px' }}
          onClick={() => setAnswer1('yes')}
        >
          Yes
        </button>
      </div>
      {answer1 === 'no' && (
        <div style={{ color: 'red', fontWeight: 'bold' }}>
          Please contact the nearest workshop as there may be a serious problem.<br />
          Consult a mechanic and the possibility that your battery is weak.
        </div>
      )}
      {/* Q2 */}
      {answer1 === 'yes' && (
        <>
          <div style={{ marginBottom: 24 }}>
            <strong>2) Do you feel that your vehicle's performance has decreased?</strong>
          </div>
          <div style={{ marginBottom: 24 }}>
            <button
              style={{ marginRight: 16, padding: '8px 24px' }}
              onClick={() => {
                setAnswer2('no');
                setAnswer3(null); setAnswer4(null); setAnswer5(null);
                setAnswer6(null); setAnswer7(null); setAnswer8(null); setAnswer9(null); setAnswer10(null);
              }}
            >
              No
            </button>
            <button
              style={{ padding: '8px 24px' }}
              onClick={() => setAnswer2('yes')}
            >
              Yes
            </button>
          </div>
          {answer2 === 'yes' && (
            <div style={{ color: 'orange', fontWeight: 'bold' }}>
              If yes, then you may need to service or tune up.
            </div>
          )}
          {/* Q3 */}
          {answer2 === 'no' && (
            <>
              <div style={{ marginBottom: 24 }}>
                <strong>3) Is the Check Engine light on while the vehicle is operating?</strong>
              </div>
              <div style={{ marginBottom: 24 }}>
                <button
                  style={{ marginRight: 16, padding: '8px 24px' }}
                  onClick={() => {
                    setAnswer3('no');
                    setAnswer4(null); setAnswer5(null);
                    setAnswer6(null); setAnswer7(null); setAnswer8(null); setAnswer9(null); setAnswer10(null);
                  }}
                >
                  No
                </button>
                <button
                  style={{ padding: '8px 24px' }}
                  onClick={() => setAnswer3('yes')}
                >
                  Yes
                </button>
              </div>
              {answer3 === 'yes' && (
                <div style={{ color: 'red', fontWeight: 'bold' }}>
                  If yes, then you should immediately take your vehicle to the nearest workshop.
                </div>
              )}
              {/* Q4 */}
              {answer3 === 'no' && (
                <>
                  <div style={{ marginBottom: 24 }}>
                    <strong>4) Is the Oil Engine light on while the vehicle is operating?</strong>
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <button
                      style={{ marginRight: 16, padding: '8px 24px' }}
                      onClick={() => {
                        setAnswer4('no');
                        setAnswer5(null);
                        setAnswer6(null); setAnswer7(null); setAnswer8(null); setAnswer9(null); setAnswer10(null);
                      }}
                    >
                      No
                    </button>
                    <button
                      style={{ padding: '8px 24px' }}
                      onClick={() => setAnswer4('yes')}
                    >
                      Yes
                    </button>
                  </div>
                  {answer4 === 'yes' && (
                    <div style={{ color: 'red', fontWeight: 'bold' }}>
                      If yes, then you should immediately take your vehicle to the nearest workshop for a detailed engine check.
                    </div>
                  )}
                  {/* Q5 */}
                  {answer4 === 'no' && (
                    <>
                      <div style={{ marginBottom: 24 }}>
                        <strong>5) Is the Red Coolant light on while the vehicle is operating?</strong>
                      </div>
                      <div style={{ marginBottom: 24 }}>
                        <button
                          style={{ marginRight: 16, padding: '8px 24px' }}
                          onClick={() => {
                            setAnswer5('no');
                            setAnswer6(null); setAnswer7(null); setAnswer8(null); setAnswer9(null); setAnswer10(null);
                          }}
                        >
                          No
                        </button>
                        <button
                          style={{ padding: '8px 24px' }}
                          onClick={() => setAnswer5('yes')}
                        >
                          Yes
                        </button>
                      </div>
                      {answer5 === 'yes' && (
                        <div style={{ color: 'red', fontWeight: 'bold' }}>
                          If yes, then you should immediately take your vehicle to the nearest workshop for a detailed engine check.
                        </div>
                      )}
                      {/* Q6 */}
                      {answer5 === 'no' && (
                        <>
                          <div style={{ marginBottom: 24 }}>
                            <strong>6) Is your vehicle vibrating abnormally while operating?</strong>
                          </div>
                          <div style={{ marginBottom: 24 }}>
                            <button
                              style={{ marginRight: 16, padding: '8px 24px' }}
                              onClick={() => {
                                setAnswer6('no');
                                setAnswer7(null); setAnswer8(null); setAnswer9(null); setAnswer10(null);
                              }}
                            >
                              No
                            </button>
                            <button
                              style={{ padding: '8px 24px' }}
                              onClick={() => setAnswer6('yes')}
                            >
                              Yes
                            </button>
                          </div>
                          {answer6 === 'yes' && (
                            <div style={{ color: 'red', fontWeight: 'bold' }}>
                              If yes, then you should immediately take your vehicle to the nearest workshop for a detailed engine check.
                            </div>
                          )}
                          {/* Q7 */}
                          {answer6 === 'no' && (
                            <>
                              <div style={{ marginBottom: 24 }}>
                                <strong>7) Is your vehicle's steering wheel tilted to the left or right while driving?</strong>
                              </div>
                              <div style={{ marginBottom: 24 }}>
                                <button
                                  style={{ marginRight: 16, padding: '8px 24px' }}
                                  onClick={() => {
                                    setAnswer7('no');
                                    setAnswer8(null); setAnswer9(null); setAnswer10(null);
                                  }}
                                >
                                  No
                                </button>
                                <button
                                  style={{ padding: '8px 24px' }}
                                  onClick={() => setAnswer7('yes')}
                                >
                                  Yes
                                </button>
                              </div>
                              {answer7 === 'yes' && (
                                <div style={{ color: 'red', fontWeight: 'bold' }}>
                                  If yes, then you should immediately take your vehicle to the nearest workshop for a detailed suspension check.
                                </div>
                              )}
                              {/* Q8 */}
                              {answer7 === 'no' && (
                                <>
                                  <div style={{ marginBottom: 24 }}>
                                    <strong>8) Is there an abnormal noise when turning the steering wheel?</strong>
                                  </div>
                                  <div style={{ marginBottom: 24 }}>
                                    <button
                                      style={{ marginRight: 16, padding: '8px 24px' }}
                                      onClick={() => {
                                        setAnswer8('no');
                                        setAnswer9(null); setAnswer10(null);
                                      }}
                                    >
                                      No
                                    </button>
                                    <button
                                      style={{ padding: '8px 24px' }}
                                      onClick={() => setAnswer8('yes')}
                                    >
                                      Yes
                                    </button>
                                  </div>
                                  {answer8 === 'yes' && (
                                    <div style={{ color: 'red', fontWeight: 'bold' }}>
                                      If yes, then you should immediately take your vehicle to the nearest workshop for a detailed suspension check.
                                    </div>
                                  )}
                                  {/* Q9 */}
                                  {answer8 === 'no' && (
                                    <>
                                      <div style={{ marginBottom: 24 }}>
                                        <strong>9) Is your vehicle leaking colored fluid after being parked for a long time?</strong>
                                      </div>
                                      <div style={{ marginBottom: 24 }}>
                                        <button
                                          style={{ marginRight: 16, padding: '8px 24px' }}
                                          onClick={() => {
                                            setAnswer9('no');
                                            setAnswer10(null);
                                          }}
                                        >
                                          No
                                        </button>
                                        <button
                                          style={{ padding: '8px 24px' }}
                                          onClick={() => setAnswer9('yes')}
                                        >
                                          Yes
                                        </button>
                                      </div>
                                      {answer9 === 'yes' && (
                                        <div style={{ color: 'red', fontWeight: 'bold' }}>
                                          If yes, then you should immediately take your vehicle to the nearest workshop for a detailed engine check.
                                        </div>
                                      )}
                                      {/* Q10 */}
                                      {answer9 === 'no' && (
                                        <>
                                          <div style={{ marginBottom: 24 }}>
                                            <strong>10) Is your vehicle's air conditioning system hot or not functioning?</strong>
                                          </div>
                                          <div style={{ marginBottom: 24 }}>
                                            <button
                                              style={{ marginRight: 16, padding: '8px 24px' }}
                                              onClick={() => setAnswer10('no')}
                                            >
                                              No
                                            </button>
                                            <button
                                              style={{ padding: '8px 24px' }}
                                              onClick={() => setAnswer10('yes')}
                                            >
                                              Yes
                                            </button>
                                          </div>
                                          {answer10 === 'yes' && (
                                            <div style={{ color: 'red', fontWeight: 'bold' }}>
                                              If yes, then you should immediately take your vehicle to the nearest workshop for a detailed air conditioning check.
                                            </div>
                                          )}
                                          {answer10 === 'no' && (
                                            <div style={{ color: 'green', fontWeight: 'bold' }}>
                                              Your vehicle is likely still in good condition.
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default SelfDiagnosis;