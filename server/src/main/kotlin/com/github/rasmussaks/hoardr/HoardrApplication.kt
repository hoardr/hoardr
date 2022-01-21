package com.github.rasmussaks.hoardr

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.transaction.annotation.EnableTransactionManagement

@SpringBootApplication
@EnableTransactionManagement
class HoardrApplication

fun main(args: Array<String>) {
    runApplication<HoardrApplication>(*args)
}
