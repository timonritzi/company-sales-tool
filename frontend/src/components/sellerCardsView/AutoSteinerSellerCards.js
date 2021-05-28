import React, { useEffect } from 'react';
import './Style.css'
import { getSellersAction } from '../../store/actions/sellerAction'
import { useDispatch, useSelector} from 'react-redux';
import gui from "../../images/gui.jpg"
import phone from "../../images/phone-call.svg"
import {Link} from "react-router-dom";
import logoAutoS from "../../assets/logo/logoAutoSteiner_test.svg"


export const AutoSteinerCards = (props) => {

    const { sellers } = useSelector((state) => state.sellers)
    const dispatch = useDispatch();


    const sellerProfileLinkHandler = (e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

    }
    // console.log(sellers)



    useEffect(() => {
        dispatch(getSellersAction);
        document.title = "Auto-Steiner"


    }, [])

    return (
        <>
            <head>
                <title>Auto-Steiner</title>

            </head>
            <section className="mainContainerViewCardsSeller" >

                <a href="https://auto-steiner-ag.ch" className="link-logo"><img className="logo-sellercards" src={logoAutoS}/></a>

                <section className="sectionContainerCards">
                    {sellers.length ? sellers.map(seller => {
                        if (seller.autohaus === "AutoSteiner" || seller.username === "peterstocker") {

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
