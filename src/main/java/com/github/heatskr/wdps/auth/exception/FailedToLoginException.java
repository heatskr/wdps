package com.github.heatskr.wdps.auth.exception;

public class FailedToLoginException extends Exception {

    public FailedToLoginException(String username) {
        super(username);
    }
}
