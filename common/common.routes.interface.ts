import express from "express";

export interface ConfigureRoutes {
    configureRoutes(): express.Application;
}