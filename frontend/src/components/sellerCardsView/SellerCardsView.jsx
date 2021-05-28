import React, { useEffect } from 'react';
import './Style.css'
import { getSellersAction } from '../../store/actions/sellerAction'
import { useDispatch, useSelector} from 'react-redux';
import gui from "../../images/gui.jpg"
import phone from "../../images/phone-call.svg"
import {Link} from "react-router-dom";
import logoAutoG from "../../assets/logo/Auto_Graf_Neues_Logo-kombi-bmw-mini.png"


export const SellerCardsView = (props) => {

    const { sellers } = useSelector((state) => state.sellers)
    const dispatch = useDispatch();


    const sellerProfileLinkHandler = (e) => {

        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

    }
    // console.log(sellers)



    useEffect(() => {
        dispatch(getSellersAction);
        document.title = "Auto-Graf"


    }, [])

    return (
        <>

            <section className="mainContainerViewCardsSeller" >

                <a href="https://www.autograf.ch/" className="link-logo"><img className="logo-sellercards" src={logoAutoG}/></a>

                <section className="sectionContainerCards">
                    {sellers.length ? sellers.map(seller => {
                        if (seller.autohaus === "AutoGraf-BMW") {

                            return (
                            <Link to={"/main/" + seller.username} id="link"><div className="cardSeller" id={`seller-${seller.id}`}>
                                <div className="containerImageCard">
                                    <img className="avatar" src={seller.avatar}/>
                                </div>
                                <div className="sectionInfoSeller">
                                    <div className="divInfoTypeAndName">
                                        <p className="sellerName">{seller.first_name + " " + seller.last_name}</p>
                                        <p className="SellerType">{seller.position}</p>
                                        <div className="divSellerPhoneNumber">
                                            <p className="sellerPhoneNumber"><a href={'tel:' + seller.phone} onClick={sellerProfileLinkHandler}>{seller.phone}</a></p>
                                        </div>
                                    </div>

                                </div>

                                <div className="containerImagesInfo">
                                    <div className="containerMessageIcon">
                                        <i className="fas fa-comment-alt" />
                                    </div>
                                    <div className="containerCam">
                                        <i className="fas fa-video" />
                                    </div>
                                    <div className="containerInfo" id="pippo">
                                        <img src={phone}/>
                                    </div>
                                </div>
                            </div></Link>
                        )
                        }

                    }) : null
                    }
                </section>
            </section>
        </>
    )
}