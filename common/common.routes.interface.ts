import express from "express";

export interface CommonRoutesInterface {
    configureRoutes(): express.Application;
}