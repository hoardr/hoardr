package com.github.rasmussaks.hoardr.graphql

import com.querydsl.core.types.Ops
import com.querydsl.core.types.dsl.BooleanOperation
import com.querydsl.core.types.dsl.Expressions

val ONE_EQUALS_ONE: BooleanOperation = Expressions.booleanOperation(Ops.EQ, Expressions.ONE, Expressions.ONE)
