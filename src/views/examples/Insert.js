import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import Header from "components/Headers/Header.js";
import './Insert.css'; 

function Insert() {
  const [csvFile, setCsvFile] = useState(null);
  const [uploading, setUploading] = useState(false); 
  const [predicting, setPredicting] = useState(false); 

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file.type === 'text/csv') {
      setCsvFile(file);
    } else {
      alert('Пожалуйста, выберите файл CSV.');
    }
  };

  const handlePredict = async () => {
    try {
      setPredicting(true); // Show predict preloader
      try {

        const response = await fetch('https://omstuback-production.up.railway.app/fraud/predict?' + new URLSearchParams({
          null_flag: false,
  }), {
          method: 'POST',
        });
  
        if (response.ok) {
          console.log('successfully!');
        } else {
          console.error('Error Prediction.');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Prediction complete!');
    } catch (error) {
      console.error('An error occurred during prediction:', error);
    } finally {
      setPredicting(false); 
    }
  };

  const handleUpload = async () => {
    try {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', csvFile);
        const response = await fetch('https://omstuback-production.up.railway.app/data/inputCSV', {
          method: 'POST',
          body: formData,
          
        });
  
        if (response.ok) {
          console.log('File uploaded successfully!');
        } else {
          console.error('Error uploading file.');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('File uploaded successfully!');
    } catch (error) {
      console.error('An error occurred during file upload:', error);
    } finally {
      setUploading(false); 
    }
  };

  const handleClick = async () => {
    await handleUpload();
    await handlePredict();
  };

  return (
    <>
      <Header />
      <Container>
        <Row>
          <Col>
            <h2 className="insert">Загрузите файл для дальнейшей работы</h2>
            <div className="drop-zone">
              <p>Перетащите или нажмите здесь для загрузки файла CSV.</p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
              />
            </div>
            <Button className="InsertButton" onClick={handleClick}>
              Отправить
            </Button>
            <br/>
            {uploading && <p>Uploading... </p>}
            {predicting && <p>Predicting... </p>}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Insert;
