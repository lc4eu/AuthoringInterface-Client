import React from 'react'
import "./home.css"
import first_one from "./first_one.png"
import second_one from "./second_one.png"
import third_one from "./third_one.png"
import fourth_one from "./fourth_one.png"
import fifth_one from "./fifth_one.png"
import sixth_one from "./sixth_one.png"
import {FaEnvelope,FaPhone,FaMobile} from 'react-icons/fa'
import { NavLink } from 'react-router-dom'

const Home = () => {
  return (

    <div>
      <div id="upper">
      <div id="about">
      <h1>Communicate</h1>
      <p id='pas'>Write your content in our Authoring Interface and your content will be delivered in multiple texts
      </p>
      <h1>Impact</h1>
      <p id="pas">We reduce the language barrier and facilitate use of your language to communicate with speakers
      of any other language. </p>
      </div>


      <img id="news" src="https://i.pinimg.com/564x/59/32/29/593229739184504afd9507cc42a9cb86.jpg" />
      </div>
      <button type="submit" id='trynow'><NavLink to="/spi" id="link">Try now</NavLink></button>
      <h1>Features</h1>
      <div class="container">
        <div class="box">
          <img src={first_one} id="img_in_box"></img>
       <h2>Add/Add text</h2>
       <p>Provide your text in the available languages to generate the USR.</p>
        </div>
        <div class="box">
        <img src={second_one} id="img_in_box"></img>
        <h2>Generate USR</h2>
        <p>Generate the Universal Semantic Representation USR, that captures the essence of your text.</p>
        </div>
        <div class="box">
        <img src={third_one} id="img_in_box"></img>
        <h2>Verify</h2>
        <p>Review and edit each USR to ensure it means exactly what you want to say!</p>
        </div>
    </div>
    <div class="container">
        <div class="box">
        <img src={fourth_one} id="img_in_box"></img>
        <h2>Generate!</h2>
        <p>Generate the text in another language using USR as the medium</p>
        </div>
        <div class="box">
        <img src={fifth_one} id="img_in_box"></img>
        <h2>USR Editor</h2>
        <p>Edit word chunks or sentences using our Editor that allows you to submit revisions and corrections.</p>
        </div>
        <div class="box">
        <img src={sixth_one} id="img_in_box"></img>
        <h2>Sentence Relations</h2>
        <p>Inter and Intra sentence relations are illustrated using shapes and patterns</p>
        </div>
    </div>
    <div class="research">
      <h1>Research</h1>

        <div class="container2">

           <div class="box2">
           <h2>Purpose</h2>
           <p> The aim is to develop a Language Communicator Tool. This tool is proposed to be designed to take the semantic representation of discourse as input and return natural language discourse as output.</p>
            </div>
        </div>

    </div>
      <div class="people">
        <h1>People</h1>
        <div class="container3">
            <div class="box3">
              <h3>image</h3>
            </div>
            <div class="box3">
              <h3>image</h3>
            </div>
            <div class="box3">
              <h3>image</h3>
            </div>
            <div class="box3">
              <h3>image</h3>
            </div>
        </div>
      </div>

        <h2>Contact Us</h2>
        <div class="contactus">
        <div class="map">
        <iframe width="100%" height="200" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=520&amp;height=600&amp;hl=en&amp;q=Kohli%20centre%20on%20Intelligent%20Systems+(Kohli%20centre%20on%20Intelligent%20Systems)&amp;t=k&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.maps.ie/distance-area-calculator.html">measure acres/hectares on map</a></iframe>
          </div>
          <div class="map">
          <form>
            <input type="text" name='Name' placeholder='Name' id='name'></input>
            <br/>
            <input type="email" name='Email'placeholder='E-mail' id="name"></input>
            <br/>
            <input type="text" name='Message' placeholder='Address' id="address"></input>
            <br/>
            <button id="button" type='button'> Submit</button>
          </form>
        </div>

      </div>
      <div class="footer">
          <div class="add">
            <p>Language Technologies Research Cebtre (LTRC)<br/>1st Floor , Kohli Centre on Intelligent Systems(KCIS)<br/>International Institute if Information Technology, Hyderabad<br/>Gachibowli, Hyderabad, Telengana - 500032<br/>India</p>
          </div>
          <div class="add">
            <p><a href='mailto:soma@iiit.ac.in'><FaEnvelope class="icons"/>soma@iiit.ac.in</a><br/></p>
          </div>
        </div>
    </div>

  )
}

export default Home


